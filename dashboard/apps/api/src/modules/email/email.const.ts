export const makeANiceEmail = (
  text,
  logo,
) => `<div style="max-width: 650px; margin: 0 auto; font-family: Verdana, Geneva, Tahoma, sans-serif; color: #5c5c5c; line-height: 150%; font-size: 16px;">
  <div style="padding: 20px; background-color: #161C24">
    <img
      src="${logo}"
      alt="Logo"
      style="max-height: 40px; display: block; max-width: 100%"
    />
  </div>
  <div style="padding: 50px 20px; background-color: transparent">
    ${text}
  <div style="height: 1px; width: 100%; background-color: #5c5c5c; margin-top: 100px;"></div>
  </div>
</div>`;
