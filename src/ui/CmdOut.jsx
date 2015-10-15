import React from 'react';
import db from 'app/db';
import updateOnKey from 'app/fn/updateOnKey';
import { hasTag } from 'app/Tag';

class CmdOut extends React.Component {
  render() {
    return (
      <div className='cmdout'>
        <div className='cmdout__content'>
          {this.renderItems()}
        </div>
      </div>
    );
  }

  renderItems() {
    var ctx = db.value.get(':db/context');
    var tags = db.value.get(':db/tags');

    if (hasTag(ctx, ':context/filter-by-tag')) {
      return tags
        .filter(tag => tag.toLowerCase().indexOf(ctx.filter.value.toLowerCase()) === 0)
        .slice(0, 5)
        .map(tag => <div className='cmdout__item'>{`#${tag}`}</div>);
    }

    return [];
  }
}

export default updateOnKey(CmdOut, ':db/context');