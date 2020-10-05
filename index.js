const puppeter = require('puppeteer')
const fs = require('fs')
const util = require('util')
const { url } = require('inspector')

let scrape_url = async()=>{
    let url = 'https://www.regus.com/en-us/canada/listings?page='
    let page_url = []
    for(let i = 1; i <= 11; ++i ){
        
        const browser = await puppeter.launch()
        const page = await browser.newPage()
        await page.goto(url+i)
        
        let dataUrl = await page.evaluate(()=>{
            let urls = document.getElementsByClassName('css-qyxw7g')
            let urlsPage = []
            for(let i = 0; i < urls.length; ++i){
                urlsPage.push({url : urls[i].href})
            }
            return urlsPage
        })
        page_url.push(dataUrl)
        await browser.close()
    }
    console.log(page_url)
    fs.writeFileSync('urls.json',JSON.stringify(page_url))
}

let scrape_content = async()=>{
    let urls = await get_url();
    for(let i = 0; i < urls.length; ++i){
        for(let j = 0; j < urls[i].length; ++j){

            const browser = await puppeter.launch()
            const page = await browser.newPage()
            await page.goto(urls[i][j].url)

            let data = page.evaluate(()=>{
                let name = document.querySelector('.css-17q564n').textContent
                let address = document.querySelector('.css-k2w0re').textContent
                let mapsLink = document.querySelector('.css-1y39h3w').href
                let feature = document.querySelectorAll('.css-1dxx3ns')
                let features = []

                for(let i = 0; i < feature.length; ++i){
                    features.push(feature[i])
                }
                return [name,address,mapsLink,features]
            })
            console.log(await data)
        }
    }
}

// scrape_url()

let get_url = async()=>{
    let data = await fs.promises.readFile('urls.json')
    return JSON.parse(data)
}
scrape_content()