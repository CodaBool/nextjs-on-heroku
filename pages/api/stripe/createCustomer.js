const stripe = require('stripe')(process.env.STRIPE_SK)
import { axios } from '../../../constants'
import { setCookie } from 'nookies'
import { getCustomer } from '../../../lib/helper'

export default async function (req, res) {
  try {
    let { body } = req
    const valid = await verify(body.token)
    delete body.token
    if (valid) {
      const customer = await getCustomer(null, body.email.toLowerCase(), true) // will return undefined if error occurs
      if (!customer) {
        await stripe.customers.create(body)
          .then(r => {
            res.status(200).json({password: r.metadata.password, email: r.email, id: r.id})
          })
          .catch(err => {
            res.status(500).send('Cannot Create Customer')
          })
      } else {
        res.status(500).send('Duplicate Email')
      }
    } else {
      res.status(500).send('Invalid Captcha')
    }
  } catch (err) {
    res.status(500).send('General Create User/Customer Error')
  }
}

async function verify(token) {
  const { data } = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.CAPTCHA_SECRET}&response=${token}`)
  const valid = data.success || false
  return valid
}