var Jimp = require("Jimp");
var fs = require("fs");
const { SSL_OP_NO_TLSv1_1 } = require("constants");
const { timeStamp } = require("console");

async function test(){
    let img = await Jimp.read("bottomTiles.png");
    img.autocrop();
    let bmp = img.bitmap;
    console.log(bmp.width);
    console.log(bmp.height);

    img.write("xxx.png");

    for (let x = 0; x < bmp.width; x++){
        let blankCol = true;
        let lc = img.getPixelColor(x, 0);;
        for (let y = 1; y < bmp.height; y++){
            let c = img.getPixelColor(x, y);
            if (lc != c) {
                blankCol = false;
                break;
            }
        }
        if (blankCol){
            console.log(`blank col at ${x}`);
            break;
        }
    }
    
    //console.log(c1, Jimp.intToRGBA(c1));
}

//test();
async function cropImage(inFile){
    let outFile = `crop-${inFile}`;

    let img = await Jimp.read(inFile);
    img.autocrop({cropOnlyFrames: false});
    await img.write(outFile);
}

async function rorateImage(inFile){
    let outFile = `rorate-${inFile}`;

    let img = await Jimp.read(inFile);
    img.rotate(90);
    console.log(`write to ${outFile}`);    
    await img.write(outFile);
}

async function mergeImages(inFile){
    let w = 50;
    let h = 42;
    let all = new Jimp(9*w, 5*h, 0);

    //for (let [it, t] of ['tiao', 'bing', 'wan'].entries()){
    for (let [it, t] of ['t', 'b', 'w'].entries()){
        for (i of [1, 2, 3, 4, 5, 6, 7, 8, 9]){
            let f = `${i}${t}`;
            f = `${inFile}/${f}.png`;
            let img = await Jimp.read(f);
            //console.log(img.bitmap.width, img.bitmap.height);

            all.composite(img, (i-1)*w, it*h);
            
            console.log(`
            .tile-${i}${t[0]} {
                background-position: -${w*(i-1)}px -${h*it}px
            }`);
        }
    }

    for ([i, f] of ['east', 'west', 'south', 'north', 'zhong', 'fa', 'bai'].entries()){
        fn = `${inFile}/${f}.png`;
        let img = await Jimp.read(fn);
        //console.log(img.bitmap.width, img.bitmap.height);

        all.composite(img, i*w, 3*h);
        console.log(`
        .tile-${f} {
            background-position: -${w*(i)}px -${h*3}px
        }`);
    }

    for ([i, f] of ['spring', 'summer', 'fall', 'winter', 'mei', 'lan', 'zhu', 'ju'].entries()){
        fn = `${inFile}/${f}.png`;
        let img = await Jimp.read(fn);
        //console.log(img.bitmap.width, img.bitmap.height);

        all.composite(img, i*w, 4*h);
        console.log(`
        .tile-${f} {
            background-position: -${w*(i)}px -${h*4}px
        }`);
    }

    await all.write("all.png");
}

async function splitXImage(inFile){
    let img = await Jimp.read(inFile);
    img.autocrop({cropOnlyFrames: false});
    let bmp = img.bitmap;
    let blankY;
    for (let y = 0; y < bmp.height; y++){
        let blankRow = true;
        let lc = img.getPixelColor(0, y);;
        for (let x = 1; x < bmp.width; x++){
            let c = img.getPixelColor(x, y);
            if (lc != c) {
                blankRow = false;
                break;
            }
        }
        if (blankRow){
            blankY = y;
            console.log(`blank row at ${y}`);
            break;
        }
    }
    if (blankY){
        let img2 = img.clone();
        let bmp2 = img2.bitmap;

        img.crop( 0, 0, bmp.width, blankY );   
        console.log(`write to split-onx-1-${inFile}`);
        img.autocrop({cropOnlyFrames: false});
        await img.write(`split-onx-1-${inFile}`);

        img2.crop( 0, blankY, bmp2.width, bmp2.height-blankY );   
        console.log(`write to split-onx-2-${inFile}`);
        img2.autocrop({cropOnlyFrames: false});
        await img2.write(`split-onx-2-${inFile}`);
    }
}

async function splitYImage(inFile){
    let img = await Jimp.read(inFile);
    let w1 = img.bitmap.width;
    img = img.autocrop({cropOnlyFrames: false});
    let w2 = img.bitmap.width;
    console.log(w1, w2);
    let bmp = img.bitmap;
    let blankX;
    for (let x = 0; x < bmp.width; x++){
        let blankCol = true;
        let lc = img.getPixelColor(x, 0);;
        for (let y = 1; y < bmp.height; y++){
        
            let c = img.getPixelColor(x, y);
            if (lc != c) {
                blankCol = false;
                break;
            }
        }
        if (blankCol){
            blankX = x;
            console.log(`blank col at ${x}`);
            break;
        }
    }
    if (blankX){
        let img2 = img.clone();
        let bmp2 = img2.bitmap;

        img.crop( 0, 0, blankX, bmp.height );   
        img.autocrop({cropOnlyFrames: false});
        await img.write(`split-ony-1-${inFile}`);

        console.log(blankX, 0, bmp2.width, bmp2.height);
        img2.crop( blankX, 0, bmp2.width-blankX, bmp2.height );   
        img2.autocrop({cropOnlyFrames: false});
        await img2.write(`split-ony-2-${inFile}`);

    }
}

async function main(){
    let args = process.argv.slice(2);
    let cmd = args[0];
    let inFile = args[1];
    console.log(inFile);
    inFile = inFile.replace(/^\.\\/, '');
    console.log(inFile);

    if (cmd == 'crop'){
        await cropImage(inFile);
    }
    if (cmd == 'rotate'){
        await rorateImage(inFile);
    }
    else if (cmd == 'on_x'){
        await splitXImage(inFile);
    }
    else if (cmd == 'on_y'){
        await splitYImage(inFile);
    }
    else if (cmd == 'merge'){
        await mergeImages(inFile);
    }
}
main();