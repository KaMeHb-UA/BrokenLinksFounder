require('colors');
let links = (str=>{
    var tmp = str.split(/\s+/), tmp2 = [];
    for (var i = 0; i < tmp.length; i++){
        if (tmp[i] != '') tmp2.push(tmp[i]);
    }
    return tmp2;
})(`
    /en/faq/
    /cat/game-center2/
    /en/sellout/
    /en/cat/night-club/
    /item/fabbrica-1/
    /cat/tavern/
    /category/sellout/
    /en/items/
    /ru/faq-3/
    /en/cat/recreation-center/
    /contact-form/
    /cat/sushi2/
    /ru/cat/fast-food1/
    /ru/item/fabbrica-2/
    /posts-3/
    /blog-1/
    /cat/bar/
    /ru/sellout-2/
    /cat/recreation-center/
    /ru/plans-listing-2/
    /en/cat/pub/
    /en/cat/teahouse/
    /en/cat/bar/
    /ru/cat/recreation-center1/
    /cat/steak-house/
    /plans-listing/
    /en/cat/bakery/
    /item/%D0%BC%D0%B0%D0%BA%D0%BB%D0%B0%D1%83%D0%B4/
    /ru/cat/game-center1/
    /ru/cat/sushi1/
    /item/%D0%BA%D0%B0%D1%88%D1%82%D0%B0%D0%BD-2/
    /ru/cat/teahouse1/
    /ait-food-menu-tags/%D0%BC%D1%8F%D1%81%D0%BE/
    /cat/restaurant2/
    /cat/night-club2/
    /en/cat/sushi/
    /ru/items-3/
    /cat/fast-food2/
    /advertisements-3/
    /faq-4/
    /ru/cat/restaurant1/
    /cat/pub/
    /faq/
    /en/cat/steak-house/
    /items/
    /en/cat/tavern/
`),
    request = require('request');

console.log('Fetching sitemap...'.yellow);

(new (require('sitemapper'))()).fetch('https://foodguide.in.ua/sitemap.xml').then(function(sites){
    class LoadingAnimation{
        constructor(text = ''){
            this.constructedWith = text;
            this.internalTimer = (function(){
                var P = [" \\ ", " | ", " / ", "---"];
                var x = 0;
                return setInterval(function(){
                    process.stdout.clearLine();
                    process.stdout.cursorTo(0);
                    process.stdout.write(text + ' ' + P[x++]);
                    x &= 3;
                }, 250);
            })();
        }
        stop(){
            clearInterval(this.internalTimer);
            process.stdout.clearLine();
            process.stdout.cursorTo(0);
            process.stdout.write(this.constructedWith + ' ');
        }
    }
    (function checkUrl(url){
        if (url){
            var foundLinks = [],
                staticText = 'Fetching ' + url + ' '
                //*
                , anim = new LoadingAnimation('Fetching ' + url)
                /*/
                process.stdout.write(staticText + '...'.blue)
                //*/
                ;
            request(url, (error, response, body) => {
                //*
                anim.stop();
                /*/
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(staticText);
                //*/
                if (!error){
                    links.forEach(link=>{
                        if (body.indexOf(link) + 1) foundLinks.push(link);
                    });
                    console.log('OK'.green);
                    foundLinks.forEach(link=>{
                        console.log('    FOUND LINK MATCH: '.yellow + link);
                    });
                } else {
                    console.log('cannot fetch url'.red);
                }
                checkUrl(sites.sites.shift());
            });
        }
    })(sites.sites.shift());
});
