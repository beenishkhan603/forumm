import { useLazyQuery, useMutation } from '@apollo/client'
import { CREATE_EVENT } from '@graphql/events/createEvent'
import { GET_ORGANISERS_BY_COMPANY } from '@graphql/users/getOrganiserByCompany'
import { GET_USER_PERMISSIONS } from '@graphql/users/getUserPermissions'
import { UPDATE_LAST_ACTIVE } from '@graphql/users/updateLastActive'
import { CreateEventInput, Event } from '@graphql/__generated/graphql'
import { AuthContextType, ProfileInfo } from '@type/Hooks/useAuth/Auth.type'
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserAttribute,
  CognitoUserPool,
  CognitoUserSession,
  CookieStorage,
  IAuthenticationDetailsData,
  ICognitoUserAttributeData,
  ICognitoUserData,
} from 'amazon-cognito-identity-js'
import { createContext, useContext, useEffect, useState } from 'react'
import { universityNames } from './universities'

const cookieDomain = process.env.NEXT_PUBLIC_DOMAIN as string
const userPoolId = process.env.NEXT_PUBLIC_USER_POOL_ID as string
const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string

export const AuthContext = createContext<AuthContextType>({
  setProfile: () => {},
})

export const userPool = new CognitoUserPool({
  UserPoolId: userPoolId,
  ClientId: clientId,
  Storage: new CookieStorage({
    domain: cookieDomain,
    sameSite: 'strict',
    secure: true,
  }),
})

export const useAuthLoader = () => {
  const auth = useContext(AuthContext)
  const [createEvent] = useMutation(CREATE_EVENT)
  const [getPerms, { loading, error, data }] =
    useLazyQuery(GET_USER_PERMISSIONS)

  const [getOrganisersForCompany, _] = useLazyQuery(GET_ORGANISERS_BY_COMPANY)

  const { getSession, currentUser, setAttributes } = useAuth()
  useEffect(() => {
    const load = async () => {
      await getSession()
      await getProfile()
        .then((profileData) => {
          auth.setProfile(profileData)
          return profileData
        })
        .then(async (profileData) => await handleOnboarding(profileData))
    }
    if (auth.profile == null) {
      load()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getProfile = async (): Promise<ProfileInfo> => {
    const attributes = await getAttributes()
    const userName = currentUser?.getUsername()
    const dict: { [index: string]: string } = attributes.reduce(
      (prev, cur) => ({ ...prev, [cur.Name]: cur.Value }),
      {}
    )

    const parseOtherProfiles = (profileStr: string | undefined) => {
      if (profileStr) {
        return JSON.parse(profileStr.trim())
      }
      return null
    }

    const parsePermissions = (permissions: string[] | undefined) => {
      if (!permissions) return {}

      let payload: {
        [type: string]: { [action: string]: string[] }
      } = {}

      permissions.forEach((perm) => {
        const [type, action, resource] = perm.split('::')
        /* console.log({ perm, type, action, resource }) */

        if (!payload[type])
          payload = {
            ...payload,
            [type]: {},
          }

        if (!payload[type][action])
          payload = {
            ...payload,
            [type]: {
              ...payload[type],
              [action]: [],
            },
          }

        payload = {
          ...payload,
          [type]: {
            ...payload[type],
            [action]: [...payload[type][action], resource],
          },
        }
      })

      return payload
    }

    const decodedUsername = decodeURIComponent(userName || '')
    const isEmail =
      decodedUsername && /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(decodedUsername)
    const userId = isEmail ? dict['sub'] : userName
    const groups = await getGroups()
    return {
      profileImageUrl: dict['custom:profileImageUrl'],
      fullName: dict['custom:fullName'],
      phoneNumber: dict['custom:phoneNumber'],
      jobTitle: dict['custom:jobTitle'],
      companyTitle: dict['custom:companyTitle'],
      university: dict['custom:university'],
      isOnboarded: dict['custom:isOnboarded'],
      acceptedTcPp: dict['custom:acceptedTcPp'] === 'true' ? true : false,
      isAnonymous: dict['custom:isAnonymous'],
      company: dict['custom:company'],
      changedPassword: dict['custom:changedPassword'],
      otherProfiles: parseOtherProfiles(dict['custom:otherProfiles']),
      email: dict['email'],
      userId: userId,
      groups: groups,
      permissions: parsePermissions(await getPermissions(userId)),
      organizer_eligible: await getOrganiserForUserOrg(
        dict['custom:university'],
        groups
      ).then((d) => d.length < 1),
    }
  }

  const handleOnboarding = async (profile: ProfileInfo): Promise<void> => {
    if (!profile.groups?.includes('organizer')) return
    if (profile.isOnboarded === 'true') return

    // add demo event
    const createEventParams: CreateEventInput = {
      event: {
        title: 'Demo Event',
        description:
          'An onboarding event to get you up and running with Forumm',
        organizationName: 'Forumm Team',
        startDateTime: '2021-01-01T00:00:00.000Z',
        endDateTime: '2024-01-01T00:00:00.000Z',
        eventMainColour: '#f1f1f1',
        eventBackgroundColour: '#1f1f1f',
        eventTextColour: '#FFFFFF',
        shortDescription: 'Personal Forumm onboarding event',
        bannerImage:
          'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
        thumbnailImage:
          'https://assets.tumblr.com/images/default_header/optica_pattern_11.png',
      },
    }
    try {
      await createEvent({
        variables: {
          input: createEventParams,
        },
      })
        .then(async () => {
          setAttributes([{ Name: 'custom:isOnboarded', Value: 'true' }])
        })
        .then(() => {
          auth.setProfile({ ...profile, isOnboarded: 'true' })
        })
    } catch (err) {
      console.error(err)
    }
  }

  const getAttributes = async (): Promise<CognitoUserAttribute[]> => {
    await getSession()
    return new Promise<CognitoUserAttribute[]>(function (resolve, reject) {
      currentUser?.getUserAttributes((err, attributes) => {
        if (err || attributes == null) {
          reject(err)
        } else {
          resolve(attributes)
        }
      })
    }).catch((err) => {
      throw err
    })
  }

  const getPermissions = async (userId?: string): Promise<string[]> => {
    return await new Promise<string[]>(async (resolve, reject) => {
      if (currentUser == null) {
        reject(new Error('Current User is null'))
      }
      await getPerms({
        variables: { input: { userId: userId ?? currentUser?.getUsername()! } },
      }).then((result) => {
        resolve(result.data?.getUserPermissions ?? ['NOAUTH'])
      })
    })
  }

  const getGroups = async (): Promise<string[]> => {
    return await new Promise<string[]>((resolve, reject) => {
      if (currentUser == null) {
        reject(new Error('Current User is null'))
      }
      currentUser?.getSession(
        (_error: Error, session: CognitoUserSession | null) => {
          if (session != null) {
            resolve(session?.getAccessToken().payload['cognito:groups'] ?? [])
          }
          reject(new Error('Session is null'))
        }
      )
    })
  }

  const getOrganiserForUserOrg = async (uni?: string, groups?: string[]) => {
    if (!auth.profile && !uni) return []
    if (groups?.includes('organizer') || groups?.includes('forumm-admin'))
      return [auth.profile]

    const data = await getOrganisersForCompany({
      variables: { company: uni ?? auth?.profile?.university! },
    }).then((d) => d.data)
    return data?.getOrganiserByCompany?.items ?? []
  }
}

export const useAuth = () => {
  const auth = useContext(AuthContext)
  const [setUserActive] = useMutation(UPDATE_LAST_ACTIVE)

  const [publicProfile, setPublicProfile] = useState(auth.profile)

  useEffect(() => {
    setPublicProfile(auth.profile)
  }, [auth.profile])

  let currentUser: CognitoUser | null = userPool.getCurrentUser()

  const isAdmin =
    !!auth.profile && auth.profile.groups?.includes('forumm-admin')
  const isOrganizer =
    !!auth.profile && auth.profile.groups?.includes('organizer')

  const isLogged = !!currentUser

  useEffect(() => {
    if (typeof window !== undefined) {
      if (window && !window.ForummUtil)
        window.ForummUtil = { changeOrg: () => {} }

      window.ForummUtil = {
        changeOrg: (newOrg: string) => {
          if (!isAdmin) {
            console.log(
              '[ForummUtil | Error] You are not authorized to change your organisation.'
            )
            return
          }
          setAttributes([{ Name: 'custom:university', Value: newOrg }])
          console.log('[ForummUtil | Info] Organisation changed successfully.')
        },
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const canEditEvent = (e: Event) => {
    if (!auth.profile) return false
    if (isAdmin) return true
    if (isOrganizer) {
      if (e.organizerId === auth.profile?.userId) return true
      if (
        auth.profile?.company?.toLowerCase() ===
        e.event?.organizationName.toLowerCase()
      )
        return true
    }
    return false
  }

  const signUpUserWithEmail = async (
    email: string,
    password: string,
    attributes: ICognitoUserAttributeData[]
  ) => {
    const customAttributes = attributes.map(
      (attribute) => new CognitoUserAttribute(attribute)
    )
    return new Promise(function (resolve, reject) {
      const attributeList = [
        ...customAttributes,
        new CognitoUserAttribute({
          Name: 'email',
          Value: email,
        }),
      ]

      userPool.signUp(
        email,
        password,
        attributeList,
        [],
        function (err, res) {
          if (err) {
            reject(err)
          } else {
            resolve(res)
          }
        },
        {}
      )
    }).catch((err) => {
      throw err
    })
  }

  const getCognitoUser = (username: string) => {
    const userData: ICognitoUserData = {
      Username: username,
      Pool: userPool,
      Storage: new CookieStorage({ domain: cookieDomain }),
    }
    const cognitoUser = new CognitoUser(userData)

    return cognitoUser
  }

  const getSession = (): Promise<CognitoUserSession> => {
    if (!currentUser || currentUser === null) {
      currentUser = userPool.getCurrentUser()
    }

    return new Promise<CognitoUserSession>(function (resolve, reject) {
      currentUser?.getSession(function (err: any, session: CognitoUserSession) {
        if (err) {
          reject(err)
        } else {
          resolve(session)
        }
      })
    }).catch((err) => {
      throw err
    })
  }

  const verifyCode = async (email: string, code: string) => {
    return new Promise(function (resolve, reject) {
      const cognitoUser = getCognitoUser(email)

      cognitoUser.confirmRegistration(code, true, function (err, result) {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    }).catch((err) => {
      throw err
    })
  }

  const signInWithEmail = async (
    username: string,
    password: string
  ): Promise<CognitoUserSession> => {
    return new Promise<CognitoUserSession>(function (resolve, reject) {
      const authenticationData: IAuthenticationDetailsData = {
        Username: username,
        Password: password,
      }
      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      )

      currentUser = getCognitoUser(username)

      currentUser.authenticateUser(authenticationDetails, {
        onSuccess: function (res: CognitoUserSession) {
          resolve(res)
        },
        onFailure: function (err: any) {
          reject(err)
        },
      })
    }).catch((err) => {
      throw err
    })
  }

  const setUserActivity = (val?: boolean) => {
    return new Promise((res, rej) => {
      try {
        setUserActive({
          variables: {
            input: {
              isLoggedIn: val ?? isLogged,
            },
          },
        }).then((data) => res(data))
      } catch (e) {
        console.log(e)
        rej(e)
      }
    })
  }

  const signOut = async () => {
    const route = () => (window.location.href = '/login')

    if (!currentUser) route()

    await setUserActivity(false).then((_) => {
      localStorage.clear()
      currentUser!.signOut()
      route()
    })
  }

  const setAttributes = async (attributes: ICognitoUserAttributeData[]) => {
    await getSession()
    return new Promise(function (resolve, reject) {
      const attributeList = attributes.map(
        (attribute) => new CognitoUserAttribute(attribute)
      )

      currentUser?.updateAttributes(attributeList, (err: any, res: any) => {
        if (err) {
          reject(err)
        } else {
          resolve(res)
        }
      })
    }).catch((err) => {
      throw err
    })
  }

  const sendCode = async (username: string) => {
    return new Promise(function (resolve, reject) {
      const cognitoUser = getCognitoUser(username)

      if (!cognitoUser) {
        reject(`could not find ${username}`)
        return
      }

      cognitoUser.forgotPassword({
        onSuccess: function (res) {
          resolve(res)
        },
        onFailure: function (err) {
          reject(err)
        },
      })
    }).catch((err) => {
      throw err
    })
  }

  const forgotPassword = (username: string, code: string, password: string) => {
    return new Promise(function (resolve, reject) {
      const cognitoUser = getCognitoUser(username)

      if (!cognitoUser) {
        reject(`could not find ${username}`)
        return
      }

      cognitoUser.confirmPassword(code, password, {
        onSuccess: function () {
          resolve('password updated')
        },
        onFailure: function (err) {
          reject(err)
        },
      })
    })
  }

  const changePassword = async (oldPassword: string, newPassword: string) => {
    await getSession()
    return new Promise(function (resolve, reject) {
      currentUser?.changePassword(
        oldPassword,
        newPassword,
        function (err: any, res: any) {
          if (err) {
            reject(err)
          } else {
            setAttributes([{ Name: 'custom:changedPassword', Value: 'true' }])
            resolve(res)
          }
        }
      )
    })
  }

  const acceptTcPp = async () => {
    setAttributes([{ Name: 'custom:acceptedTcPp', Value: 'true' }])
  }

  const hasPermission = (permissionString: string) => {
    if (!auth.profile) return false
    if (!permissionString) return false

    const { permissions } = auth.profile!
    const [type, action, resource] = permissionString.split('::')

    if (!permissions) return false
    if (!permissions[type]) return false
    if (!permissions[type][action]) return false
    if (
      permissions[type][action].find(
        (r) => r === '*' || r.toUpperCase() === resource.toUpperCase()
      )
    )
      return true
    return false
  }

  const getPermission = (permissionString: string) => {
    if (!auth.profile) return []
    if (!permissionString) return []

    const { permissions } = auth.profile!
    const [type, action, resource] = permissionString.split('::')

    if (!permissions) return []
    if (!permissions[type]) return []
    if (!permissions[type][action]) return []

    if (permissions[type][action].find((r) => r === '*')) {
      //TODO write script that returns all available permission resources for a given action.
    }

    if (permissions[type][action].length > 0) return permissions[type][action]
    return []
  }

  const changeAccess = async (organizationName: string) => {
    let realOrgName = universityNames.find(
      (uni) =>
        uni.replaceAll(' ', '_').toUpperCase() ===
        organizationName.replaceAll(' ', '_').toUpperCase()
    )
    if (!realOrgName)
      // @info: Organizations added from pricing page usually will not match any of the universities in that hardoded list, as this is an admin feature, it should let the admin proceed.
      /* throw new Error(`You do not have permission to access: ${organizationName}`) */
      realOrgName = organizationName
    if (
      !hasPermission(
        `USER::ACCESS_ORGANISATION::${organizationName.toUpperCase()}`
      )
    )
      throw new Error(`You do not have permission to access: ${realOrgName}`)

    try {
      setAttributes([{ Name: 'custom:university', Value: realOrgName }])
      setAttributes([{ Name: 'custom:company', Value: realOrgName }])
      auth.setProfile({
        ...auth.profile,
        university: realOrgName,
        company: realOrgName,
      })
    } catch (e) {
      throw e
    }
  }

  return {
    signUpUserWithEmail,
    getCognitoUser,
    getSession,
    changePassword,
    forgotPassword,
    sendCode,
    setAttributes,
    signOut,
    signInWithEmail,
    verifyCode,
    acceptTcPp,
    currentUser,
    isLogged,
    changeAccess,
    getPermission,
    publicProfile,
    isAdmin,
    isOrganizer,
    setUserActivity,
    canEditEvent,
    ...auth,
  }
}
