module.exports = async (req, res) => {
    const axios = require("axios");

    const domain = req.params.domain;

    let data;

    try {
        const result = await axios.get("https://raw.freesubdomains.org");

        data = result.data;
    } catch(err) {
        return res.status(500);
    }

    data = data.filter(item => item.domain === domain);

    if(!data[0]) return res.status(404).json({ "error": "DOMAIN_NOT_FOUND" });

    const ownerEmails = [];
    let owners = 0;

    data.forEach(item => {
        if(ownerEmails.includes(item.owner.email)) return;

        ownerEmails.push(item.owner.email);
        owners++;
    })

    const subdomains = [];

    data.forEach(item => {
        subdomains.push(item.subdomain);
    })

    return res.status(200).json({
        "count": subdomains.length,
        "individual_owners": owners,
        "subdomains": subdomains
    })
}