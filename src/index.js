require('dotenv').config()
const axios = require('axios')
const {map, head} = require('lodash')
const fs = require('fs-extra')
const json2md = require('json2md')
const moment = require('moment')
var Input = require('prompt-input');

const file = './output/output.md'

const getChannel = (channel) => {
  try {
    return axios.get(`https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=${channel}&key=${process.env.GOOGLE_API_KEY}`)
  } catch (error) {
    console.error(error)
  }
}

const getChannelId = (channel) => {
  getChannel(channel).then(response => {
    const id = head(response.data.items).contentDetails.relatedPlaylists.uploads
    getVideos(id).then(response => {
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
    }).catch(error => {
      console.error(error)
    })
  })
}

const getVideos = (id) => {
  try {
    return axios.get(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=50&playlistId=${id}&key=${process.env.GOOGLE_API_KEY}`)
  } catch (error) {
    console.error(error)
  }
}

const input = new Input({
  name: 'channel',
  message: "Enter the channel's name: "
})

input.ask(channel => {
  getChannelId(channel)
})
