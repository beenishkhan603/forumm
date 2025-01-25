import { AuthContext } from '@libs/useAuth'
import { MockedProvider, MockedResponse } from '@apollo/client/testing'
import { ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import ALL_MOCKS from './graphql/mocks'

export const defaultMockProfile: ProfileInfo = {
  company: '448 Studio',
  email: 'test@email.com',
  fullName: 'John Doe',
  university: '448 Studio',
  profileImageUrl: '/test.png',
  userId: '123',
  groups: [],
}

const MockAppWrapper = ({
  children,
  mocks,
  mockProfile = defaultMockProfile,
}: {
  mockProfile?: Partial<ProfileInfo>
  children: any
  mocks?: readonly MockedResponse<Record<string, any>>[] | undefined
}) => {
  const Layout = children?.type?.Layout ?? null

  const GQL_MOCKS: MockedResponse[] = ALL_MOCKS

  if (mocks) mocks.forEach((m) => GQL_MOCKS.push(m))
  return (
    <MockedProvider
      mocks={GQL_MOCKS}
      defaultOptions={{
        query: {
          errorPolicy: 'all',
          fetchPolicy: 'cache-first',
        },
        watchQuery: {
          errorPolicy: 'all',
          fetchPolicy: 'cache-and-network',
        },
        mutate: {
          errorPolicy: 'all',
        },
      }}
    >
      <AuthContext.Provider
        value={{
          profile: mockProfile
            ? { ...defaultMockProfile, ...mockProfile }
            : defaultMockProfile,
          setProfile: () => {},
        }}
      >
        <div id="modal-root" />
        {Layout ? <Layout>{children}</Layout> : children}
      </AuthContext.Provider>
    </MockedProvider>
  )
}

export default MockAppWrapper
