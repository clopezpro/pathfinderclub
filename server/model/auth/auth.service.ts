import mongoose from 'mongoose'
import Token from '../token/token.model'
import tokenTypes from '../token/token.types'
import { getPathfinderByEmail, getPathfinderById } from '../pathfinder/pathfinder.controller'
import type { IPathfinderDoc, IPathfinderWithTokens } from '../pathfinder/pathfinder.interfaces'
import { generateAuthTokens, verifyToken } from '../token/token.service'

/**
 * Login with pathfindername and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IPathfinderDoc>}
 */
export async function loginUserWithEmailAndPassword(email: string, password: string): Promise<IPathfinderDoc> {
  const pathfinder = await getPathfinderByEmail(email)
  if (!pathfinder || !(await pathfinder.isPasswordMatch(password))) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Incorrect email or password',
    })
  }

  return pathfinder
}

/**
 * Logout
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export async function logout(refreshToken: string): Promise<void> {
  const refreshTokenDoc = await Token.findOne({ token: refreshToken, type: tokenTypes.REFRESH, blacklisted: false })

  if (!refreshTokenDoc) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Token no encontrado',
    })
  }
  await refreshTokenDoc.deleteOne()
}

/**
 * Refresh auth tokens
 * @param {string} refreshToken
 * @returns {Promise<IPathfinderWithTokens>}
 */
export async function refreshAuth(refreshToken: string): Promise<IPathfinderWithTokens> {
  try {
    const refreshTokenDoc = await verifyToken(refreshToken, tokenTypes.REFRESH)
    const pathfinder = await getPathfinderById(new mongoose.Types.ObjectId(refreshTokenDoc.user))
    if (!pathfinder)
      throw new Error(`User not found when refresh token: ${refreshToken}`)

    await refreshTokenDoc.deleteOne()
    const tokens = await generateAuthTokens(pathfinder)
    return { pathfinder, tokens }
  }
  catch (error) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Please authenticate',
    })
  }
}
