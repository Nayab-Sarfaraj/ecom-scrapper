const { default: puppeteer } = require("puppeteer");

const fetchFlipkartProduct = async (searchQuery, currentPage) => {
  try {
    const searchArr = searchQuery.trim().split(" ");
    if (searchArr.length === 1) {
      searchQuery = searchQuery;
    } else {
      let str = "";
      searchArr.forEach((ele, i) => {
        if (i !== searchArr.length - 1) str += ele + "+";
        else str += ele;
      });
      searchQuery = str;
    }
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
    );

    const url = `https://www.flipkart.com/search?q=${searchQuery}&page=${currentPage}&sort=price_asc`;
    console.log(`Navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded" });
    console.log(`here`);
    const products = await page.evaluate(() => {
      const elements = document.querySelectorAll("div[data-id]");
      return Array.from(elements).map((item) => {
        const id = item.getAttribute("data-id");
        const image = item.querySelector("._53J4C-").getAttribute("src");
        const title = item.querySelector(".WKTcLC").getAttribute("title");
        const url = item.querySelector(".WKTcLC").getAttribute("href");
        const price = item.querySelector(".Nx9bqj").innerHTML;
        // const rating = item.querySelector(".XQDdHH").textContent;

        // return img;
        return {
          id,
          title,
          price,
          url,
          image,
        };

        // mac selector
        // const img = item.querySelector(`.DByuf4`);
        // const title = item.querySelector(".DByuf4");
        // const price = item.querySelector(".Nx9bqj");
        // const rating = item.querySelector(".XQDdHH");
        // const originalPrice = item.querySelector(".yRaY8j");
        // const url = item.querySelector(".VJA3rP");
        // const noOfReviews = item.querySelector(".Wphh3N");
        // return originalPrice
        //   ? originalPrice.innerHTML.split("<!-- -->")[1]
        //   : "No price";
        // return rating ? rating.textContent : "No Rating";
        // return noOfReviews ? noOfReviews.textContent : "No review";
        return {
          id,
          img: img ? img.getAttribute("src") : "No Image",
          title: title ? title.getAttribute("alt") : "No Title",
          price: price ? price.innerHTML : "No Price",
          rating: rating ? rating.textContent : "No Rating",
          originalPrice: originalPrice
            ? originalPrice.innerHTML.split("<!-- -->")[1]
            : "No Original Price",
          noOfReviews: noOfReviews ? noOfReviews.textContent : "No review",
        };
      });

      //   return Array.from(elements).map((item) => {
      //     let id = item.getAttribute("data-id");
      //     let img = item.querySelector(`.DByuf4`);
      //     let title = item.querySelector(".DByuf4");
      //     let price = item.querySelector(".Nx9bqj");
      //     let rating = item.querySelector(".XQDdHH");
      //     let originalPrice = item.querySelector(".yRaY8j");
      //     let url = item.querySelector(".VJA3rP");
      //     let noOfReviews = item.querySelector(".Wphh3N");

      //     return {
      //       id,
      //       img: img ? img.getAttribute("src") : "No Image",
      //       title: title ? title.getAttribute("alt") : "No Title",
      //       price: price ? price.innerHTML : "No Price",
      //       rating: rating ? rating.textContent : "No Rating",
      //       originalPrice: originalPrice
      //         ? originalPrice.innerHTML.split("<!-- -->")[1]
      //         : "No Original Price",
      //       noOfReviews: noOfReviews ? noOfReviews.textContent : "No review",
      //     };
      //   });
    });
    // console.log(products);
    await browser.close();
    return products;
  } catch (error) {
    console.log(error);
    console.log(error.message);
    console.log("GOT AN ERROR........................");
  }
};

module.exports = fetchFlipkartProduct;
