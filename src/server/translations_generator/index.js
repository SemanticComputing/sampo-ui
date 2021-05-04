import { google } from 'googleapis'
import { /* flatten, */ unflatten } from 'flat'
import fs from 'fs-extra'
import { readTranslationsFromGoogleSheets } from '../../../src/client/configs/sampo/GeneralConfig'
// import localeEN from '../../client/translations/sampo/localeEN'
import dotenv from 'dotenv'

console.log(`NODE_ENV: ${process.env.NODE_ENV}`)

dotenv.config()

// Start process with an environment variable named GOOGLE_APPLICATION_CREDENTIALS.
// The value of this env var should be the full path to the service account credential file.
// https://github.com/googleapis/google-api-nodejs-client#service-account-credentials
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

const spreadsheetId = process.env.SHEETS_API_SHEET_ID

console.log(`spreadsheetId: ${process.env.SHEETS_API_SHEET_ID}`)
console.log(`credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)

// const writeToGoogleSheet = async values => {
//   try {
//     const result = await sheets.spreadsheets.values.update({
//       spreadsheetId,
//       range: 'A:B',
//       valueInputOption: 'RAW',
//       requestBody: {
//         values
//       }
//     })
//     console.log(result)
//   } catch (error) {
//     console.error(error.errors)
//   }
// }

const readFromGoogleSheet = async () => {
  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'A:B'
    })
    return result.data.values
  } catch (error) {
    console.log(error)
  }
}

const writeToFile = async (path, data) => {
  const json = JSON.stringify(data, null, 2)

  try {
    await fs.writeFile(path, json)
    console.log('Saved data to file.')
  } catch (error) {
    console.error(error)
  }
}

const sheetValuesToFlatObject = values => {
  return values.reduce((result, item, index) => {
    result[item[0]] = item[1]
    return result
  }, {})
}

// const flattened = flatten(localeEN)

// Object.keys(flattened).forEach(key => {
//   // Change all groups of white-spaces characters to a single space in the whole string.
//   // Then trim() the result to remove all exceeding white-spaces before and after the text.
//   flattened[key] = flattened[key].trim().replace(/\s+/g, ' ')
// })

// const values = []

// for (const [key, value] of Object.entries(flattened)) {
//   values.push([key, value])
// }

// console.log(values)
// writeToGoogleSheet(values)

if (readTranslationsFromGoogleSheets) {
  readFromGoogleSheet().then(data => {
    const flatObject = sheetValuesToFlatObject(data)
    writeToFile('src/client/translations/sampo/localeEN.json', unflatten(flatObject))
  })
}
