class IDVerification {

    constructor() {
        //console.log(`new instance of IDVerification initialized`);
    }

    check(value) {
        //console.log("ID check..");
        value = value.toString();
    
        var isEleven = /^[0-9]{11}$/.test(value);
        var totalX = 0;
        for (let i = 0; i < 10; i++) {
          totalX += Number(value.substr(i, 1));
        }
        var isRuleX = totalX % 10 == value.substr(10,1);
        var totalY1 = 0;
        var totalY2 = 0;
        for (let i = 0; i < 10; i+=2) {
          totalY1 += Number(value.substr(i, 1));
        }
        for (let i = 1; i < 10; i+=2) {
          totalY2 += Number(value.substr(i, 1));
        }
        var isRuleY = ((totalY1 * 7) - totalY2) % 10 == value.substr(9,0);
    
        return isEleven && isRuleX && isRuleY;
    }

    checkVKN(value) {
      //console.log("VKN check..");
      if (value.length === 10) {
        let v = [];
        let lastDigit = Number(value.charAt(9));
        for (let i = 0; i < 9; i++) {
          let tmp = (Number(value.charAt(i)) + (9 - i)) % 10;
          v[i] = (tmp * 2 ** (9 - i)) % 9;
          if (tmp !== 0 && v[i] === 0) v[i] = 9;
        }
        let sum = v.reduce((a, b) => a + b, 0) % 10;
        return (10 - (sum % 10)) % 10 === lastDigit;
      }
      return false;
    }
}

export default IDVerification;