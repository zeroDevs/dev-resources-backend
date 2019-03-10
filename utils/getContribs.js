const fetch = require('node-fetch');
const dbHandler = require('../db/contributor.db');

// In need of some refactoring, but until we define exactly what we want from this it will do for now.

module.exports = async () => {

    const frontend = await fetch('https://api.github.com/repos/zeroDevs/dev-resources-frontend/stats/contributors')
        .then(res => res.json())

    const backend = await fetch('https://api.github.com/repos/zeroDevs/dev-resources-backend/stats/contributors')
        .then(res => res.json())
    
    const data = {};
    
    await Object.keys(frontend).forEach(e => {
        const totals = { a: 0, d: 0, c: 0}
        frontend[e].weeks.forEach(w => {
            totals.a = totals.a + w.a,
            totals.d = totals.d + w.d,
            totals.c = totals.c + w.c
        });
        
        data[frontend[e].author.login] = {
            username: frontend[e].author.login,
            id: frontend[e].author.id,
            avatar: frontend[e].author.avatar_url,
            url: frontend[e].author.html_url,
            frontend: totals   
        }
        if(data[frontend[e].author.login] && data[frontend[e].author.login].backend) data[frontend[e].author.login].backend = data[frontend[e].author.login].backend
    });

    await Object.keys(backend).forEach(async (e) => {
        const totals = { a: 0, d: 0, c: 0}
        await backend[e].weeks.forEach(w => {
            totals.a = totals.a + w.a,
            totals.d = totals.d + w.d,
            totals.c = totals.c + w.c
        });
        let feTotals;
        if(data[backend[e].author.login] && data[backend[e].author.login].frontend) feTotals = data[backend[e].author.login].frontend
        else feTotals = {a: 0, d: 0, c: 0}
        data[backend[e].author.login] = {
            username: backend[e].author.login,
            id: backend[e].author.id,
            avatar: backend[e].author.avatar_url,
            url: backend[e].author.html_url,
            frontend: feTotals,
            backend: totals
        }

        dbHandler.create(
            {
                id: backend[e].author.id,
                username: backend[e].author.login,
                avatar: backend[e].author.avatar_url,
                url: backend[e].author.html_url,
                frontend: feTotals,
                backend: totals
            });
    });
    
    console.log(data)
}