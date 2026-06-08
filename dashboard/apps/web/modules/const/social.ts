export const _socialLinkDefaultObj = {
  facebook: {
    icon: 'eva:facebook-fill',
    name: 'FaceBook',
    color: '#1877F2',
  },
  instagram: {
    icon: 'ant-design:instagram-filled',
    name: 'Instagram',
    color: '#DF3E30',
  },
  linkedin: {
    icon: 'eva:linkedin-fill',
    name: 'Linkedin',
    color: '#006097',
  },
  x: {
    icon: 'ri:twitter-x-fill',
    name: 'X',
    color: '#fff',
  },
  youtube: {
    icon: 'ant-design:youtube-filled',
    name: 'YouTube',
    color: '#FF0000',
  },
};

export const _socials = Object.keys(_socialLinkDefaultObj).map((key) => ({
  value: key,
  name: _socialLinkDefaultObj[key as keyof typeof _socialLinkDefaultObj].name,
  icon: _socialLinkDefaultObj[key as keyof typeof _socialLinkDefaultObj].icon,
  color: _socialLinkDefaultObj[key as keyof typeof _socialLinkDefaultObj].color,
}));
