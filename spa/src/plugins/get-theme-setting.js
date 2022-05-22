import allThemes from '@/themes/default';

export default () => {
    const defaultTheme = 'default';
    const hostname = window.location.hostname;
    var requestedTheme;

    if (!hostname || hostname.indexOf(".") == -1) {
        // console.log(`hostname does not contain subdomain. returning default theme: ${defaultTheme}`);
        requestedTheme = process.env.VUE_APP_PRETEND_SUBDOMAIN || defaultTheme;
        //return allThemes[subdomain] || allThemes[defaultTheme];
    } else {
        var temp = hostname.split(".");
        requestedTheme = (temp[0] || "").replace("test", "");
    }

    if (!allThemes[requestedTheme]) {
        console.log(`requested theme ${requestedTheme} does not found on themes, returning default theme: ${defaultTheme}`);
        return allThemes[defaultTheme];
    }
    return allThemes[requestedTheme];
}