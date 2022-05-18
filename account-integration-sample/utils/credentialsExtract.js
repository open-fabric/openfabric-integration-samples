import compare from 'tsscmp'


export const parseCredentials = (credentials) => {
  const authCredentials = []

  credentials.split('|').forEach(item => {
    if (item.length < 3) {
      throw new Error(
        `Received incorrect basic auth syntax, use <username>:<password>, received ${item}`
      )
    }
    const parsedCredentials = item.split(':')
    if (
      parsedCredentials[0].length === 0 ||
      parsedCredentials[1].length === 0
    ) {
      throw new Error(
        `Received incorrect basic auth syntax, use <username>:<password>, received ${item}`
      )
    }

    authCredentials.push({
      name: parsedCredentials[0],
      password: parsedCredentials[1],
    })
  })

  return authCredentials
}

/**
 * Compares the basic auth credentials with the configured user and password
 * @param credentials Basic Auth credentials object from `basic-auth`
 */
export const compareCredentials = (
  user,
  requiredCredentials
) =>
  requiredCredentials.some(
    item => compare(user.name, item.name) && compare(user.pass, item.password)
  )