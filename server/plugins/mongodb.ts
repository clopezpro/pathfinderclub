import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const { URL_MONGO } = useRuntimeConfig()

  const URL = URL_MONGO
  mongoose
    .connect(URL)
    .then(() => {
      console.log('conectado al db mongo...')
    })
    .catch((err: Error) => console.log('ERROR AL CONECTAR CON MONGO', err))
})
