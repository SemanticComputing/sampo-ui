import { google } from 'googleapis'
import { /* flatten, */ unflatten } from 'flat'
import fs from 'fs-extra'
import { readTranslationsFromGoogleSheets } from '../../../src/client/configs/sampo/GeneralConfig'
// import localeEN from '../../client/translations/sampo/localeEN'
import dotenv from 'dotenv'

dotenv.config()

// console.log(`spreadsheetId: ${process.env.SHEETS_API_SHEET_ID}`)
// console.log(`credentials: ${process.env.GOOGLE_APPLICATION_CREDENTIALS}`)

// Start process with an environment variable named GOOGLE_APPLICATION_CREDENTIALS.
// The value of this env var should be the full path to the service account credential file.
// https://github.com/googleapis/google-api-nodejs-client#service-account-credentials
const auth = new google.auth.GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
})

const sheets = google.sheets({ version: 'v4', auth })

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

const readFromGoogleSheet = async ({ spreadsheetId, ranges }) => {
  try {
    const result = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges
    })
    return result.data.valueRanges
  } catch (error) {
    console.log(error)
  }
}

const writeToFile = async (path, data) => {
  const json = JSON.stringify(data, null, 2)

  try {
    await fs.writeFile(path, json)
    console.log(`Saved translations from Google Sheets into '${path}'`)
  } catch (error) {
    console.error(error)
  }
}

const sheetValueRangesToFlatObject = valueRanges => {
  const keyArray = valueRanges[0].values
  const valueArray = valueRanges[1].values
  return keyArray.reduce((result, item, index) => {
    result[item[0]] = valueArray[index] ? valueArray[index][0] : ''
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
  const spreadsheetId = process.env.SHEETS_API_SHEET_ID

  readFromGoogleSheet({ spreadsheetId, ranges: ['Taulukko1!A:A', 'Taulukko1!B:B'] }).then(data => {
    const flatObject = sheetValueRangesToFlatObject(data)
    writeToFile('src/client/translations/sampo/localeEN.json', unflatten(flatObject))
  })
  readFromGoogleSheet({ spreadsheetId, ranges: ['Taulukko1!A:A', 'Taulukko1!C:C'] }).then(data => {
    const flatObject = sheetValueRangesToFlatObject(data)
    writeToFile('src/client/translations/sampo/localeFI.json', unflatten(flatObject))
  })
}
