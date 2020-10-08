const puppeter = require('puppeteer')
const fs = require('fs')
const util = require('util')
const {formatData,writeData} = require('./formatData')

let scrape_url = async () => {
    let url = 'https://www.regus.com/en-us/united-states/listings?page='
    let page_url = []
    for (let i = 1; i <= 86; ++i) {

        const browser = await puppeter.launch()
        const page = await browser.newPage()
        await page.goto(url + i)

        let dataUrl = await page.evaluate(() => {
            let urls = document.getElementsByClassName('css-qyxw7g')
            let urlsPage = []
            for (let i = 0; i < urls.length; ++i) {
                urlsPage.push({ url: urls[i].href })
            }
            return urlsPage
        })
        page_url.push(dataUrl)
        await browser.close()
        console.log(page_url)
    }
    console.log(page_url)
    fs.writeFileSync('urls.json', JSON.stringify(page_url))
}

let scrape_content = async () => {
    let urls = await get_url();
    for (let i = 0; i < urls.length; ++i) {
        for (let j = 0; j < urls[i].length; ++j) {

            const browser = await puppeter.launch({ headless: true })
            const page = await browser.newPage()
            await page.goto(urls[i][j].url, { 'waitUntil': 'networkidle0' })

            let data = page.evaluate(() => {
                let name = document.querySelector('.css-17q564n').textContent
                let address = document.querySelector('.css-1kp11b').textContent
                let mapsLink = document.querySelector('.css-1y39h3w').href
                let getPrice = document.querySelectorAll('.css-hd72a')
                let availableForRent = document.querySelectorAll('.css-13a70vr')
                let workspaces = []
                let typeWorkspace = ['Office Space', 'Coworking', 'Virtual Office', 'Meeting Rooms']
                let featureWorkspace = [
                    [
                        "Add or remove space as your needs change",
                        "Flexible terms means you can grow without risk",
                        "Customize your space"
                    ],
                    [
                        "Thousands of locations",
                        "Book your hot desk via our app",
                        "Network and collaborate"
                    ],
                    [
                        "Thousands of locations",
                        "Use of global business lounges",
                        "Phone answering available"
                    ],
                    [
                        "1000s of rooms to choose from",
                        "Configure to suit your needs",
                        "Reception team to greet guests"
                    ]
                ]
                for (let i = 0; i < getPrice.length; ++i) {
                    let priceArray = getPrice[i].textContent.split(" ")
                    let billingBasis = getPrice[i].textContent.replace(`From ${priceArray[1]} $`, "")
                    if (i == 2) {
                        space = undefined
                    } else {
                        try {
                            
                            space = availableForRent[i].textContent
                        } catch (error) {
                            space = 0
                        }
                    }
                    workspace = {
                        "office_type": typeWorkspace[i],
                        "AvailableForRent": space,
                        "PriceRange": {
                            "startingAt": priceArray[1],
                            'billingBasis': billingBasis
                        },
                        "Features": featureWorkspace[i],

                    }
                    workspaces.push(workspace)
                }
                let getFeatures = document.querySelectorAll('.css-1cc7wd6')
                let features = []
                for (let i = 0; i < getFeatures.length; ++i) {

                    features.push(getFeatures[i].textContent)
                }

                let getHighlitedFeatures = document.querySelectorAll('.css-fifhx')
                let highlitedFeatures = []

                for (let i = 0; i < getHighlitedFeatures.length; ++i) {
                    highlitedFeatures.push(getHighlitedFeatures[i].textContent)
                }

                let headerDesc = document.querySelector('.css-hunstr').textContent
                let contentDesc = document.querySelector('.css-vpwhoz').textContent
                let desc = {
                    header: headerDesc,
                    content: contentDesc
                }
                let image = document.querySelectorAll('.css-1bwf1no')
                let img = []
                for (let i = 0; i < image.length; ++i) {
                    let imgHref = image[i].getElementsByTagName('img')
                    for (let j = 0; j < imgHref.length; ++j) {
                        img.push(imgHref[j].src)
                    }
                }

                let getHighlitedImages = document.querySelectorAll('.css-onjkit')
                let highlitedImages = []
                for (let i = 0; i < getHighlitedImages.length; ++i) {
                    highlitedImages.push(getHighlitedImages[i].src)
                }

                return [name, address, mapsLink, workspaces, features, highlitedFeatures, desc,img,highlitedImages]
            })
                
            let formattedData = formatData(await data,urls[i][j].url)
            
            writeData(await formattedData)
            console.log(JSON.stringify(formattedData, null, 4))
            await browser.close()
        }

    }
}

// scrape_url()

let get_url = async () => {
    let data = await fs.promises.readFile('urls_us.json')
    return JSON.parse(data)
}
scrape_content()

// (async () => {
//     const browser = await puppeter.launch()
//     let page = await browser.newPage()
//     await page.goto('https://www.regus.com/en-us/canada/ottawa/ottawa-zibi-ottawa-5480', { waitUntil: "networkidle0" })
//     let data = page.evaluate(() => {
//         let image = document.querySelectorAll('.css-1bwf1no')
//         let img = []
//         for (let i = 0; i < image.length; ++i) {
//             let imgHref = image[i].getElementsByTagName('img')
//             for (let j = 0; j < imgHref.length; ++j) {
//                 img.push(imgHref[j].src)
//             }
//         }
//         return img
//     })
//     console.log(await data)
// })()