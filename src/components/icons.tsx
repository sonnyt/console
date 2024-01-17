const Icons = {
  loading: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </>
  ),
  run: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" strokeWidth={0} fill="currentColor" />
    </>
  ),
  error: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 21a9 9 0 0 0 9 -9a9 9 0 0 0 -9 -9a9 9 0 0 0 -9 9a9 9 0 0 0 9 9z" />
      <path d="M9 8l6 8" />
      <path d="M15 8l-6 8" />
    </>
  ),
  warning: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 9v4" />
      <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" />
      <path d="M12 16h.01" />
    </>
  ),
  right: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M9 6l6 6l-6 6" />
    </>
  ),
  down: (
    <>
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M6 9l6 6l6 -6" />
    </>
  )
};

function IconComponent(type: keyof typeof Icons) {
  return function Icon({ ...props }: React.SVGAttributes<HTMLOrSVGElement>) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" {...props} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
        {Icons[type]}
      </svg>
    );
  };
}

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  loading: IconComponent('loading'),
  run: IconComponent('run'),
  error: IconComponent('error'),
  warning: IconComponent('warning'),
  right: IconComponent('right'),
  down: IconComponent('down')
};