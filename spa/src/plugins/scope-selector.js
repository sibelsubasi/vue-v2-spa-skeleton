const SUBDOMAIN_TO_SCOPE_MAPPER = {
    "admin": "pc-portal-user pc-portal-admin pc-portal-manager pc-portal-superuser",
    "demo": "pc-portal-user pc-portal-admin pc-portal-manager pc-portal-superuser",
}

export default () => {
    const hostname = window.location.hostname;
    var subdomain;

    if (!hostname || hostname.indexOf(".") == -1) {
        console.warn(`hostname does not contain subdomain. Can not determine the scope!!! Returning PRETENDED domain: ${process.env.VUE_APP_PRETEND_SUBDOMAIN}`);
        subdomain = process.env.VUE_APP_PRETEND_SUBDOMAIN || "";
    } else {
        var temp = hostname.split(".")
        subdomain = (temp[0] || "").replace(
            process.env.VUE_APP_USE_TEST_APIS == 'true' ? 'test' 
            : process.env.VUE_APP_USE_DEV_APIS == 'true' ? 'dev' : '', '');
    }

    console.log(`SUBDOMAIN_TO_SCOPE_MAPPER[subdomain]:${SUBDOMAIN_TO_SCOPE_MAPPER[subdomain]} `);
    var scope = "default";
    if (SUBDOMAIN_TO_SCOPE_MAPPER[subdomain] !== undefined) {
        scope = SUBDOMAIN_TO_SCOPE_MAPPER[subdomain];
    }

    return scope;
}