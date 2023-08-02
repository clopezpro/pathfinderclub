import jwt from 'jsonwebtoken'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type mongoose from 'mongoose'
import type { IPathfinderDoc } from '../pathfinder/pathfinder.interfaces'
import { pathfinderController } from '../pathfinder/'

import Token from './token.model'
import tokenTypes from './token.types'
import type { AccessAndRefreshTokens, ITokenDoc } from './token.interfaces'

const { jwtConfig } = useRuntimeConfig()

/**
 * Generate token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Dayjs} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
export function generateToken(userId: mongoose.Types.ObjectId,
  expires: Dayjs,
  type: string,
  secret: string = jwtConfig.secret): string {
  const payload = {
    sub: userId,
    iat: dayjs().unix(),
    exp: expires.unix(),
    type,
  }
  return jwt.sign(payload, secret)
}

/**
 * Save a token
 * @param {string} token
 * @param {mongoose.Types.ObjectId} userId
 * @param {Dayjs} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<ITokenDoc>}
 */
export async function saveToken(token: string,
  userId: mongoose.Types.ObjectId,
  expires: Dayjs,
  type: string,
  blacklisted = false): Promise<ITokenDoc> {
  const tokenDoc = await Token.create({
    token,
    user: userId,
    expires: expires.toDate(),
    type,
    blacklisted,
  })
  return tokenDoc
}

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<ITokenDoc>}
 */
export async function verifyToken(token: string, type: string): Promise<ITokenDoc> {
  const payload = jwt.verify(token, jwtConfig.secret)
  if (typeof payload.sub !== 'string') {
    throw createError({
      statusCode: 404,
      statusMessage: 'Usuario Erroneo',
    })
  }

  const tokenDoc = await Token.findOne({
    token,
    type,
    user: payload.sub,
    blacklisted: false,
  })
  if (!tokenDoc)
    throw new Error('Token not found')

  return tokenDoc
}

/**
 * Generate auth tokens
 * @param {IPathfinderDoc} user
 * @returns {Promise<AccessAndRefreshTokens>}
 */
export async function generateAuthTokens(user: IPathfinderDoc): Promise<AccessAndRefreshTokens> {
  const accessTokenExpires = dayjs().add(jwtConfig.accessExpirationMinutes, 'minutes')
  const accessToken = generateToken(user.id, accessTokenExpires, tokenTypes.ACCESS)

  const refreshTokenExpires = dayjs().add(jwtConfig.refreshExpirationDays, 'days')
  const refreshToken = generateToken(user.id, refreshTokenExpires, tokenTypes.REFRESH)
  await saveToken(refreshToken, user.id, refreshTokenExpires, tokenTypes.REFRESH)

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  }
}

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export async function generateResetPasswordToken(email: string): Promise<string> {
  const user = await pathfinderController.getPathfinderByEmail(email)
  if (!user) {
    throw createError({
      statusCode: 204,
      statusMessage: '',
    })
  }

  const expires = dayjs().add(jwtConfig.resetPasswordExpirationMinutes, 'minutes')
  const resetPasswordToken = generateToken(user.id, expires, tokenTypes.RESET_PASSWORD)
  await saveToken(resetPasswordToken, user.id, expires, tokenTypes.RESET_PASSWORD)
  return resetPasswordToken
}

/**
 * Generate verify email token
 * @param {IPathfinderDoc} user
 * @returns {Promise<string>}
 */
export async function generateVerifyEmailToken(user: IPathfinderDoc): Promise<string> {
  const expires = dayjs().add(jwtConfig.verifyEmailExpirationMinutes, 'minutes')
  const verifyEmailToken = generateToken(user.id, expires, tokenTypes.VERIFY_EMAIL)
  await saveToken(verifyEmailToken, user.id, expires, tokenTypes.VERIFY_EMAIL)
  return verifyEmailToken
}
