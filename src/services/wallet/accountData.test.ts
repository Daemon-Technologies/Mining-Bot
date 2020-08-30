import { getAccount } from "./accountData"

describe('getAccount test', function() {
    it('account from localStorage', function() {
      expect(getAccount).to.be.equal(2);
    });
  });