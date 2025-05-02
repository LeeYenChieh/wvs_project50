const ENDPOINT = 'https://m0xju1.logto.app';
const API_BAES_URL = `${ENDPOINT}/api`
const API_RESOURCE = 'https://api.m0xju1.logto.app/api'
const JWKS_URL = 'https://m0xju1.logto.app/oidc/jwks'
const ISSUER = 'https://m0xju1.logto.app/oidc'
const TOKEN_POINT = `${ENDPOINT}/oidc/token`
const M2MId = '89wai0xiokse8e9r5atj9'
const M2MSecret = 'Exrgh5T6Gnb5dpaPKGwPwhfQVhS5R7dm'
const AppId = 'k57fns1jagvscm2mx4a3t';
const RoleNameToId = new Map([
    ['User', 'v677df9f2bjfiqhujnstq'],
    ['Admin', '09ugt1b4tckooa7wpiei8'],
    ['Handsome_guy', 'nzrjz9me3qurkfwbrly3h']
])


export { ENDPOINT, API_BAES_URL, API_RESOURCE, JWKS_URL, ISSUER, TOKEN_POINT, M2MId, M2MSecret, AppId, RoleNameToId };