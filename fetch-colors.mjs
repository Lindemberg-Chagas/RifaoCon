import https from 'https';

https.get('https://batismoparoquiansfatima.vercel.app/', (resp) => {
  let data = '';
  resp.on('data', (chunk) => { data += chunk; });
  resp.on('end', () => {
    // Find linked CSS files
    const cssLinks = data.match(/href="([^"]+\.css)"/g) || [];
    console.log("CSS Links:", cssLinks);
    
    if (cssLinks.length > 0) {
        const cssUrl = cssLinks[0].replace('href="', '').replace('"', '');
        const fullUrl = cssUrl.startsWith('http') ? cssUrl : `https://batismoparoquiansfatima.vercel.app${cssUrl.startsWith('/') ? '' : '/'}${cssUrl}`;
        
        console.log("Fetching CSS:", fullUrl);
        https.get(fullUrl, (cssResp) => {
            let cssData = '';
            cssResp.on('data', (c) => cssData += c);
            cssResp.on('end', () => {
                // Extract variable declarations or tailwind color maps
                const rootVars = cssData.match(/--[a-zA-Z0-9-]+:\s*[^;]+;/g) || [];
                console.log("CSS Vars:", rootVars.filter(v => v.includes('#') || v.includes('rgb') || v.includes('hsl')));
                
                // If it's pure tailwind we might see things like .bg-primary{background-color:#xxxxxx}
                const bgMatches = cssData.match(/\.bg-primary(?:-dark|-light)?\{background-color:([^}]+)\}/g) || [];
                const goldMatches = cssData.match(/\.bg-gold(?:-dark|-light)?\{background-color:([^}]+)\}/g) || [];
                console.log("Primary BGs:", bgMatches);
                console.log("Gold BGs:", goldMatches);
                
                const textMatches = cssData.match(/\.text-primary(?:-dark|-light)?\{color:([^}]+)\}/g) || [];
                const goldTextMatches = cssData.match(/\.text-gold(?:-dark|-light)?\{color:([^}]+)\}/g) || [];
                console.log("Primary Texts:", textMatches);
                console.log("Gold Texts:", goldTextMatches);
            });
        });
    }
  });
}).on("error", (err) => {
  console.log("Error: " + err.message);
});
