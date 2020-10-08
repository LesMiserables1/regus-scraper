const fs = require('fs')
const us_states = {
    "AL": "Alabama",
    "AK": "Alaska",
    "AS": "American Samoa",
    "AZ": "Arizona",
    "AR": "Arkansas",
    "CA": "California",
    "CO": "Colorado",
    "CT": "Connecticut",
    "DE": "Delaware",
    "DC": "District Of Columbia",
    "FM": "Federated States Of Micronesia",
    "FL": "Florida",
    "GA": "Georgia",
    "GU": "Guam",
    "HI": "Hawaii",
    "ID": "Idaho",
    "IL": "Illinois",
    "IN": "Indiana",
    "IA": "Iowa",
    "KS": "Kansas",
    "KY": "Kentucky",
    "LA": "Louisiana",
    "ME": "Maine",
    "MH": "Marshall Islands",
    "MD": "Maryland",
    "MA": "Massachusetts",
    "MI": "Michigan",
    "MN": "Minnesota",
    "MS": "Mississippi",
    "MO": "Missouri",
    "MT": "Montana",
    "NE": "Nebraska",
    "NV": "Nevada",
    "NH": "New Hampshire",
    "NJ": "New Jersey",
    "NM": "New Mexico",
    "NY": "New York",
    "NC": "North Carolina",
    "ND": "North Dakota",
    "MP": "Northern Mariana Islands",
    "OH": "Ohio",
    "OK": "Oklahoma",
    "OR": "Oregon",
    "PW": "Palau",
    "PA": "Pennsylvania",
    "PR": "Puerto Rico",
    "RI": "Rhode Island",
    "SC": "South Carolina",
    "SD": "South Dakota",
    "TN": "Tennessee",
    "TX": "Texas",
    "UT": "Utah",
    "VT": "Vermont",
    "VI": "Virgin Islands",
    "VA": "Virginia",
    "WA": "Washington",
    "WV": "West Virginia",
    "WI": "Wisconsin",
    "WY": "Wyoming"
}

const can_states = {
    "AB": "Alberta",
    "BC": "British Columbia",
    "MB": "Manitoba",
    "NB": "New Brunswick",
    "NL": "Newfoundland and Labrador",
    "NS": "Nova Scotia",
    "NT": "Northwest Territories",
    "NU": "Nunavut",
    "ON": "Ontario",
    "PE": "Prince Edward Island",
    "QC": "Québec",
    "SK": "Saskatchewan",
    "YT": "Yukon"
  }
//   return [name, address, mapsLink, workspaces, features, highlitedFeatures, desc, highlitedImages,img]

let formatData = (data,url)=>{
    let splitAddress = data[1].split(', ')
    let shortState
    let state
    let country
    if(splitAddress[2] == "CAN"){
        shortState = splitAddress[1][0] + splitAddress[1][1]
        state = can_states[shortState]
        console.log(state)
        country = 'Canada'
    }else{
        shortState = splitAddress[1][0] + splitAddress[1][1]
        state = us_states[shortState]
        country = 'United States'
    }
    let formattedData = {
        "name" : data[0],
        "url" : url,
        "address":{
            "fullAddress" : data[1],
            "country" : country,
            "state" : state,
            "city" : splitAddress[0],
            "mapsLink" : data[2]
        },
        "workspaces" : data[3],
        "features" : data[4],
        "featuresHighlited" : data[5],
        "description" : data[6],
        "images" : data[7],
        "highlitedImages" : data[8]
    }
    return formattedData
}
let writeData = async(result)=>{
    
    let file = await fs.promises.readFile('result_us.json',"utf8")
    let dataParse = JSON.parse(file)
    dataParse.push(result)
    fs.writeFileSync('result_us.json',JSON.stringify(dataParse))
}
module.exports = {
    formatData,
    writeData
}