import { useState, useContext, useEffect } from 'react'
import { CreateEventContext } from '@libs/CreateEventContext'
import Box from '@components/base/Box'
import { GET_EVENTS_BY_COMPANY_OVERVIEWS } from '@graphql/events/getEventsByCompanyOverviews'
import { useQuery } from '@apollo/client'
import Select, { Options } from 'react-select'
import currencies from '@libs/currencies'
import LoadingSpinner from '@components/base/LoadingSpinner'

interface FundraiseOption {
  value: string
  label: string
  imageUrl: string
  goal: string
}

const customStyles = {
  option: (provided: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
  singleValue: (provided: any) => ({
    ...provided,
    display: 'flex',
    alignItems: 'center',
  }),
}

const CustomOption = (props: any) => {
  const { data, innerRef, innerProps } = props
  return (
    <div
      ref={innerRef}
      {...innerProps}
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {data.imageUrl ? (
        <img
          src={data.imageUrl}
          alt={data.label}
          style={{ width: '40px', height: '40px', marginRight: '10px' }}
        />
      ) : (
        <div
          style={{
            width: '40px',
            height: '40px',
            marginRight: '10px',
            backgroundColor: '#f0f0f0',
          }}
        />
      )}
      <div>
        <div>{data.label}</div>
        <div style={{ fontSize: '0.8em', color: '#888' }}>{data.goal}</div>
      </div>
    </div>
  )
}

const FundraisingPicker = ({
  organisation,
  currency,
}: {
  organisation?: string
  currency: string
}) => {
  const [selectedOption, setSelectedOption] = useState<
    undefined | FundraiseOption
  >(undefined)
  const [started, setStarted] = useState<boolean>(false)
  const { formData, setFormData } = useContext(CreateEventContext)

  const { loading, data: companyData } = useQuery(
    GET_EVENTS_BY_COMPANY_OVERVIEWS,
    {
      variables: { company: organisation ?? '' },
      skip: !organisation,
    }
  )

  const options: Options<FundraiseOption> = [
    {
      value: '',
      label: 'None',
      imageUrl: '',
      goal: '',
    },
    ...(companyData?.getEventsByCompany ?? [])
      .filter(
        (row) =>
          row?.event?.eventType === 'FUNDRAISER' && row?.event?.donationUrl
      )
      .map((row) => {
        return {
          value: row?.event?.donationUrl ?? '',
          label: row?.event?.title ?? '',
          imageUrl: row?.event?.bannerImage ?? '',
          goal: `${currencies[currency ?? 'GBP'].symbol}${
            row?.fundraising?.goal
          }`,
        }
      }),
  ]

  useEffect(() => {
    if (
      !started &&
      options &&
      options.length > 0 &&
      formData &&
      formData?.event
    ) {
      setStarted(true)
      if (formData?.event?.donationUrl) {
        const initialValue = options.filter(
          (opt) => opt.value === formData?.event?.donationUrl
        )?.[0]
        if (initialValue) setSelectedOption(initialValue)
      }
    }
  }, [formData, options, started])

  const handleChange = (option: any) => {
    setSelectedOption(option)

    setFormData({
      ...formData,
      // @ts-ignore
      event: {
        ...formData?.event,
        donationUrl: option?.value || undefined,
      },
    })
  }

  return (
    <Box className="w-full">
      <Box className="mt-6 mb-4 text-sm">
        Choose a fundraiser from the list below or select &quot;None&quot; if
        none apply:
      </Box>
      {}
      <Select
        options={options}
        styles={{
          ...customStyles,
          menuPortal: (base) => ({ ...base, zIndex: 1000 }),
        }}
        components={{ Option: CustomOption }}
        onChange={handleChange}
        value={selectedOption || ''}
        isLoading={loading}
        menuPortalTarget={document.body}
        loadingMessage={() => (
          <Box className="flex justify-center w-full">
            <LoadingSpinner size="small" />
          </Box>
        )}
      />
    </Box>
  )
}

export default FundraisingPicker
