require('dotenv').config()
const axios = require('axios')
const {map} = require('lodash')
const fs = require('fs-extra')
const json2md = require('json2md')
const moment = require('moment')

const file = './output.md'

const getVideos = () => {
  try {
    return axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=UUz-BYvuntVRt_VpfR6FKXJw&key=${process.env.GOOGLE_API_KEY}`)
  } catch (error) {
    console.error(error)
  }
}

const countVideos = async () => {
  const videos = getVideos()
    .then(response => {
      formattedVideos = map(response.data.items, video => {
        const {title, description, publishedAt} = video.snippet
        return json2md([
          {p: `**${title}**`},
          {ul: [
            {p: moment(publishedAt).format("MMM Do YYYY")},
            {p: description}
          ]}
        ])
      })
      fs.outputFile(file, formattedVideos)
    })
    .catch(error => {
      console.log(error)
    })
}

countVideos()