const imageData = [
    { src: "./Photo/pic3.jpg", category: "nature" },
    { src: "./Photo/pic5.jpg", category: "flower" },
    { src: "./Photo/pic7.jpg", category: "nature" },
    { src: "./Photo/pic8.jpg", category: "nature" },
    { src: "./Photo/pic8.jpg", category: "nature" },
    { src: "./Photo/1.jpg", category: "fruit" },
    { src: "./Photo/2.jpg", category: "fruit" },
    { src: "./Photo/3.jpg", category: "fruit" },
    { src: "./Photo/4.jpg", category: "fruit" },
    { src: "./Photo/5.jpg", category: "fruit" },
    { src: "./Photo/6.jpg", category: "fruit" },
    { src: "./Photo/7.jpg", category: "fruit" },
    { src: "./Photo/8.jpg", category: "fruit" },
    { src: "./Photo/9.jpg", category: "fruit" },
    { src: "./Photo/10.jpg", category: "fruit" },
    { src: "./Photo/11.jpg", category: "fruit" },
    { src: "./Photo/12.jpg", category: "fruit" },
    { src: "./Photo/13.jpg", category: "fruit" },
    { src: "./Photo/14.jpg", category: "fruit" },
    { src: "./Photo/119.webp", category: "fruit" },
    { src: "./Photo/120.webp", category: "fruit" },
    { src: "./Photo/121.webp", category: "fruit" },
    { src: "./Photo/122.webp", category: "fruit" },
    { src: "./Photo/123.webp", category: "fruit" },
    { src: "./Photo/124.webp", category: "fruit" },
    { src: "./Photo/125.webp", category: "fruit" },
    { src: "./Photo/126.webp", category: "fruit" },
    { src: "./Photo/127.webp", category: "fruit" },
    { src: "./Photo/128webp", category: "fruit" },


    { src: "./Photo/15.jpg", category: "nature" },
    { src: "./Photo/16.jpg", category: "nature" },
    { src: "./Photo/17.jpg", category: "nature" },
    { src: "./Photo/18.jpg", category: "nature" },
    { src: "./Photo/19.jpg", category: "nature" },
    { src: "./Photo/20.jpg", category: "nature" },
    { src: "./Photo/21.jpg", category: "nature" },
    { src: "./Photo/22.jpg", category: "nature" },
    { src: "./Photo/23.jpg", category: "nature" },
    { src: "./Photo/24.jpg", category: "tech" },
    { src: "./Photo/25.jpg", category: "tech" },
    { src: "./Photo/26.jpg", category: "tech" },

    { src: "./Photo/117.webp", category: "nature" },
    { src: "./Photo/118.webp", category: "nature" },
    { src: "./Photo/135.webp", category: "nature" },
    { src: "./Photo/136.webp", category: "nature" },
    { src: "./Photo/62.jpg", category: "nature" },
    { src: "./Photo/27.jpg", category: "nature" },
    { src: "./Photo/28.jpg", category: "nature" },
    { src: "./Photo/29.jpg", category: "nature" },
    { src: "./Photo/30.jpg", category: "nature" },
    { src: "./Photo/31.jpg", category: "nature" },
    { src: "./Photo/32.jpg", category: "nature" },
    { src: "./Photo/130.webp", category: "nature" },
    { src: "./Photo/131.webp", category: "nature" },
    { src: "./Photo/132.webp", category: "nature" },
    { src: "./Photo/133.webp", category: "nature" },

    { src: "./Photo/33.jpg", category: "food" },
    { src: "./Photo/34.jpg", category: "food" },
    { src: "./Photo/35.jpg", category: "food" },
    { src: "./Photo/36.jpg", category: "food" },
    { src: "./Photo/37.jpg", category: "food" },
    { src: "./Photo/38.jpg", category: "food" },
    { src: "./Photo/39.jpg", category: "food" },
    { src: "./Photo/40.jpg", category: "food" },
    { src: "./Photo/41.jpg", category: "food" },
    { src: "./Photo/42.jpg", category: "food" },
    { src: "./Photo/43.jpg", category: "food" },
    { src: "./Photo/44.jpg", category: "food" },
    { src: "./Photo/129.webp", category: "food" },


    { src: "./Photo/46.webp", category: "creative" },
    { src: "./Photo/47.webp", category: "creative" },
    { src: "./Photo/48.webp", category: "creative" },
    { src: "./Photo/49.webp", category: "creative" },
    { src: "./Photo/50.webp", category: "creative" },
    { src: "./Photo/51.webp", category: "creative" },
    { src: "./Photo/52.webp", category: "creative" },
    { src: "./Photo/53.webp", category: "creative" },
    { src: "./Photo/54.webp", category: "creative" },
    { src: "./Photo/55.webp", category: "creative" },
    { src: "./Photo/56.webp", category: "creative" },
    { src: "./Photo/57.webp", category: "creative" },
    { src: "./Photo/58.webp", category: "creative" },
    { src: "./Photo/59.webp", category: "creative" },
    { src: "./Photo/60.webp", category: "creative" },
    { src: "./Photo/61.webp", category: "creative" },
    { src: "./Photo/137.webp", category: "creative" },
    { src: "./Photo/138.webp", category: "creative" },
    { src: "./Photo/139.webp", category: "creative" },
    { src: "./Photo/140.webp", category: "creative" },
    { src: "./Photo/141.webp", category: "creative" },
    { src: "./Photo/142.webp", category: "creative" },
    { src: "./Photo/143.webp", category: "creative" },
    { src: "./Photo/144.webp", category: "creative" },
    { src: "./Photo/145.webp", category: "creative" },
    { src: "./Photo/146.webp", category: "creative" },
    { src: "./Photo/147.webp", category: "creative" },
    { src: "./Photo/148.webp", category: "creative" },
    { src: "./Photo/149.webp", category: "creative" },
    

    { src: "./Photo/63.webp", category: "cartoon" },
    { src: "./Photo/64.webp", category: "cartoon" },
    { src: "./Photo/65.webp", category: "cartoon" },
    { src: "./Photo/66.webp", category: "cartoon" },
    { src: "./Photo/67.webp", category: "cartoon" },
    { src: "./Photo/68.webp", category: "cartoon" },
    { src: "./Photo/69.webp", category: "cartoon" },
    { src: "./Photo/70.webp", category: "cartoon" },
    { src: "./Photo/71.webp", category: "cartoon" },
    { src: "./Photo/72.webp", category: "cartoon" },
    { src: "./Photo/73.webp", category: "cartoon" },
    { src: "./Photo/74.webp", category: "cartoon" },
    { src: "./Photo/75.webp", category: "cartoon" },
    { src: "./Photo/76.webp", category: "cartoon" },
    { src: "./Photo/77.webp", category: "cartoon" },
    { src: "./Photo/78.webp", category: "cartoon" },
    { src: "./Photo/79.webp", category: "cartoon" },
    { src: "./Photo/80.webp", category: "cartoon" },
    { src: "./Photo/81.webp", category: "cartoon" },
    { src: "./Photo/82.webp", category: "cartoon" },
    { src: "./Photo/83.webp", category: "cartoon" },
    { src: "./Photo/84.webp", category: "cartoon" },
    { src: "./Photo/85.webp", category: "cartoon" },
    { src: "./Photo/86.webp", category: "cartoon" },
    { src: "./Photo/87.webp", category: "cartoon" },
    { src: "./Photo/88.webp", category: "cartoon" },
    { src: "./Photo/89.webp", category: "cartoon" },
    { src: "./Photo/90.webp", category: "cartoon" },
    { src: "./Photo/91.webp", category: "cartoon" },
    { src: "./Photo/92.webp", category: "cartoon" },
    { src: "./Photo/93.webp", category: "cartoon" },
    { src: "./Photo/94.webp", category: "cartoon" },
    { src: "./Photo/95.webp", category: "cartoon" },
    { src: "./Photo/96.webp", category: "cartoon" },
    { src: "./Photo/97.webp", category: "cartoon" },
    { src: "./Photo/98.webp", category: "cartoon" },
    { src: "./Photo/99.webp", category: "cartoon" },
    { src: "./Photo/100.webp", category: "cartoon" },
    { src: "./Photo/101.webp", category: "cartoon" },
    { src: "./Photo/102.webp", category: "cartoon" },
    { src: "./Photo/103.webp", category: "cartoon" },
    { src: "./Photo/104.webp", category: "cartoon" },
    { src: "./Photo/106.webp", category: "nature" },
    { src: "./Photo/107.webp", category: "nature" },
    { src: "./Photo/108.webp", category: "nature" },
    { src: "./Photo/109.webp", category: "nature" },
    { src: "./Photo/110.webp", category: "creative" },
    { src: "./Photo/111.webp", category: "cartoon" },
    { src: "./Photo/112.webp", category: "cartoon" },
    { src: "./Photo/113.webp", category: "cartoon" },
    { src: "./Photo/114.webp", category: "cartoon" },
    { src: "./Photo/115.webp", category: "cartoon" },
    { src: "./Photo/116.webp", category: "nature" },
  
    { src: "./Photo/134.webp", category: "animal" },

];
