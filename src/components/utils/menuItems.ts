import { IconType } from 'react-icons/lib';

interface MenuItem {
  name: string;
  icon?: IconType;
  link: string;
  submenu?: { name: string; link: string; icon?: IconType }[];
}
const menuItems: MenuItem[] = [
  {
    name: 'Nam',
    link: '/nam',
  },
  //   {
  //     name: "",
  //     link: "",
  //     submenu: [
  //       {
  //         name: "",
  //         link: "",
  //       }
  //     ],
  //   },
];
export default menuItems;
