require('colors');
const LoadingAnimation = require('loading-animation'),
    fs = require('fs'),
    request = require('request'),
    Sitemapper = require('sitemapper'),
    rl = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }),
    userAgents = [
        {
            name: 'Native',
            string: 'Mozilla/5.0 (compatible; StringFinder/0.0.1-a; https://github.com/KaMeHb-UA)'
        },
        {
            name: 'Chrome',
            string: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36'
        },
    ];

let anim = new LoadingAnimation('Reading ./strings.list');

fs.readFile(__dirname + '/strings.list', 'utf8', (err, list) => {
    anim.stop();
    if (!err){
        console.log('OK'.green);

        let links = (() => {
            var tmp = list.split(/[\r\n]?[\r\n]\s*/), tmp2 = [];
            for (var i = 0; i < tmp.length; i++){
                if (tmp[i] != '') tmp2.push(tmp[i]);
            }
            return tmp2;
        })();

        rl.question('Enter sitemap link (e.g. https://google.com/sitemap.xml): ', url => {
            if (!url.match(/^https?:\/\/.*?\..*/)){
                console.log('Not a valid address. Exiting...'.red);
                process.exit(1);
            }
            console.log('List of included User Agents:');
            userAgents.forEach((agent, i) => {
                console.log(`[${i}] ` + `[${agent.name}]`.green + ` ${agent.string}`);
            });
            rl.question(`Enter your choose [0 - ${userAgents.length - 1}]: ` , i => {
                if (!userAgents[i]){
                    console.log('Not a valid choice. Exiting...'.red);
                    process.exit(1);
                }
                anim = new LoadingAnimation('Fetching sitemap'.yellow);
                (new Sitemapper()).fetch(url).then(function(sites){
                    anim.stop();
                    console.log('OK'.green);
                    (function checkUrl(url){
                        if (url){
                            var foundLinks = [];
                            anim = new LoadingAnimation('Fetching ' + url);
                            request(url, {
                                    headers: {
                                        'User-Agent': userAgents[i].string
                                    }
                                }, (error, response, body) => {
                                anim.stop();
                                if (!error){
                                    links.forEach(link=>{
                                        if (body.indexOf(link) + 1) foundLinks.push(link);
                                    });
                                    console.log('OK'.green);
                                    foundLinks.forEach(link=>{
                                        console.log('    FOUND STRING MATCH: '.yellow + link);
                                    });
                                } else {
                                    console.log('FAIL'.red);
                                }
                                checkUrl(sites.sites.shift());
                            });
                        } else {
                            console.log('All pages checked. Read log for more'.green);
                            process.exit(0);
                        }
                    })(sites.sites.shift());
                }).catch(function(reason){
                    anim.stop();
                    console.log('FAIL'.green + ` (${reason})`);
                    process.exit(1);
                });
                 
            })
        });
    } else {
        console.log('FAIL'.red);
        process.exit(1);
    }
});
