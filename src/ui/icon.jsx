export default function Icon({ id }) {
  return (
    <svg className='icon' viewBox='0 0 100 100'>
      <use xlinkHref={`#${id}`} />
    </svg>
  );
}
