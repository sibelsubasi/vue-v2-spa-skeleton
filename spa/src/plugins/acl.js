import store from "@/store";

var _permissions = null;
var _includeDemoRoutes = process.env.VUE_APP_INCLUDE_DEMO_FUNCS === "true";

const _genericPermissions = [
    'POST:/',
    'POST:/home',
    'POST:/auth/logout',
];
class Acl {

    constructor() {
        // console.log(`new instance of Acl initialized`);
        if (_permissions === null) {
            if (!store.state.user || !store.state.user.permissions) {
                // console.log(`fetch accees token for this time`);
                store.dispatch('fetchAccessToken');
            }
            _permissions = [];
            store.state.user.permissions.forEach((p) => {
                _permissions.push(p.permission);//
            });
            //    console.log(_permissions);
        }
    }

    /**
     * e.g: { "permission": "PUT:/contract/customer" }
     */
    has(method, api) {
        if (api === true) {
            return true;
        }
        // return true;
        if (api && api.indexOf('/secure/') === 0) {
            api = api.substr(7);
        }
        var u = `${method}:${api}`;

        var has = _genericPermissions.indexOf(u) > -1 || _permissions.indexOf(u) > -1;

        has = has || (api.startsWith("/demo/") && _includeDemoRoutes);

        //  console.log(JSON.stringify(_permissions));
        //    console.log(`User has permisson: ${u} - ${has}`);
        return has;

    }
}
export default Acl;