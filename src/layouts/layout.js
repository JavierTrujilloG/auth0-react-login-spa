const Layout = ({ children }) => {
  return (
    <>
      <div className=" bg-blue pt-2 pl-4">
        <span className="w-[300px] h-[44px] inline-block bg-[url('https://login.klm.com/login/assets/components/26.1.0/kl/logo/kl-logo-2022.svg')]"></span>
        <span
          aria-hidden="true"
          className="inline-block w-[50px] h-[44px] bg-[url('https://login.klm.com/login/assets/components/26.1.0/kl/logo/skyteam-logo-2022.svg')]"></span>
      </div>
      <div className="bg-sky-500 h-[44px] p-8 flex items-center justify-center text-white">
        <span className="text-2xl"> Log in </span>
      </div>
      <div>{children}</div>
    </>
  );
};

export default Layout;
