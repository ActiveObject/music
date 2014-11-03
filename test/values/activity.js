var expect = require('chai').expect,
    Activity = require('app/values/activity');

describe('Activity model', function () {
  describe('#update', function () {
    beforeEach(function () {
      this.data = {
        total: 100,
        items: [
          { id: 1, date: new Date('2014-01-01T10:00:00') },
          { id: 2, date: new Date('2014-01-01T14:00:00') },
          { id: 3, date: new Date('2014-01-02T10:00:00') }
        ]
      };
    });

    it('should update indexed set with a new items', function () {
      expect(Activity.update(this.data, Activity.empty).indexed)
        .to.have.members([1, 2, 3]);
    });

    it('should update activity with the given items', function () {
      expect(Activity.update(this.data, Activity.empty).items)
        .to.have.deep.members([
          { date: '2014-01-01', news: 2 },
          { date: '2014-01-02', news: 1 }
        ]);
    });
  });
});