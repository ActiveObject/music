import React from 'react';
import app from 'app';
import { updateOn } from 'app/renderer';
import { hasTag } from 'app/Tag';

import './cmdout.css';

function CmdOut() {
  var ctx = app.value.get(':db/context');
  var tags = app.value.get(':db/tags');
  var items = cmdItems(ctx, tags).map(tag => CmdOutItem({ tag }));

  return (
    <div className='cmdout'>
      <div className='cmdout__content'>
        {items}
      </div>
    </div>
  );
}

function CmdOutItem({ tag }) {
  return <div className='cmdout__item'>{`#${tag}`}</div>;
}

function cmdItems(ctx, tags) {
  if (hasTag(ctx, ':context/filter-by-tag')) {
    return tags
      .filter(tag => tag.toLowerCase().indexOf(ctx.filter.value.toLowerCase()) === 0)
      .slice(0, 5);
  }

  return [];
}

export default updateOn(CmdOut, ':db/context');