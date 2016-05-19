import './ResponsiveGrid.css';

export let Section = ({ children, className }) =>
  <div className={`section ${className}`}>
    {children}
  </div>

export let Header = ({ children }) =>
  <div className='header'>
    {children}
  </div>

export let Content = ({ children }) =>
  <div className='content'>
    {children}
  </div>
