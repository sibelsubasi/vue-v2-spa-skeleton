const SUBDOMAIN_TO_ENDPOINT_MAPPER = {
    "admin": "pc-admin",
};

var __WARNED = false, __LOGGED = false;

export default (transform = true) => {
    const hostname = window.location.hostname;
    //const hostname = 'sub.sitename.com';
    var subdomain;

    if (!hostname || hostname.indexOf(".") == -1) {
        if (!__WARNED) {
            console.warn(`hostname does not contain subdomain. Can not determine the endpoints!!! Returning PRETENDED domain: ${process.env.VUE_APP_PRETEND_SUBDOMAIN}`);
            __WARNED = true;
        }
        subdomain = process.env.VUE_APP_PRETEND_SUBDOMAIN || "";
    } else {
        var temp = hostname.split(".")
        subdomain = (temp[0] || "").replace(
            process.env.VUE_APP_USE_TEST_APIS == 'true' ? 'test' 
            : process.env.VUE_APP_USE_DEV_APIS == 'true' ? 'dev' : '', '');
    }

    if (!__LOGGED) {
        console.log(`SUBDOMAIN_TO_ENDPOINT_MAPPER[subdomain]:${SUBDOMAIN_TO_ENDPOINT_MAPPER[subdomain]} `);
        __LOGGED = true;
    }
    if (!transform && process.env.VUE_APP_USE_TEST_APIS == 'true') {
        subdomain += "test";
    }
    if (!transform && process.env.VUE_APP_USE_DEV_APIS == 'true') {
        subdomain += "dev";
    }

    if (transform && SUBDOMAIN_TO_ENDPOINT_MAPPER[subdomain] !== undefined) {
        subdomain = SUBDOMAIN_TO_ENDPOINT_MAPPER[subdomain];
    }

    return subdomain;
}