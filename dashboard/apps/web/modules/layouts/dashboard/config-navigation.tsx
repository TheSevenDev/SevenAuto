import { EUserLevel, IUser, paths, permissions } from '@seven-auto/libs';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from 'modules/auth/hooks';
import Label from 'modules/components/label';
import { ICONS } from 'modules/const/icons';
import { queryName } from 'modules/const/query-name';
import apiServices from 'modules/services/apiService';
import { useMemo } from 'react';

// ----------------------------------------------------------------------

interface INavData {
  subheader: string;
  items: INavDataItem[];
  roles?: string[];
  levels?: EUserLevel[];
}

interface INavDataItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  roles?: string[];
  levels?: EUserLevel[];
  children?: {
    title: string;
    path: string;
    roles?: string[];
    levels?: EUserLevel[];
  }[];
}

export function useNavData() {
  const { currentUser } = useAuthContext();

  const { data: notificationSystem, isLoading: isLoadingNotificationSystem } =
    useQuery({
      queryKey: [queryName.GET_NOTIFICATION_SYSTEM],
      queryFn: () => apiServices.notification.getNotificationSystem(),
      enabled: !!currentUser?.id,
    });

  const notificationUsers = useMemo(
    () =>
      (notificationSystem?.payment || 0) +
      (notificationSystem?.manage?.payment || 0),
    [notificationSystem],
  );

  const data: INavData[] = useMemo(
    () => [
      // OVERVIEW
      // ----------------------------------------------------------------------
      {
        subheader: 'overview',
        items: [
          {
            title: 'dashboard',
            path: paths.dashboard.root,
            icon: ICONS.dashboard,
          },
        ],
      },

      // MANAGEMENT
      // ----------------------------------------------------------------------
      {
        subheader: 'management',
        items: [
          // USER
          {
            title: 'user',
            path: paths.dashboard.user.root,
            icon: ICONS.user,
            info: !isLoadingNotificationSystem &&
              notificationSystem &&
              notificationUsers > 0 && (
                <Label color="primary" variant="filled">
                  {notificationUsers}
                </Label>
              ),
            children: [
              {
                title: 'basic.profile',
                path: paths.dashboard.user.profile,
              },
              {
                title: 'basic.list',
                path: paths.dashboard.user.list,
                roles: [permissions.USER_VIEW],
              },
              {
                title: 'basic.create',
                path: paths.dashboard.user.new,
                roles: [permissions.USER_CREATE],
              },
              {
                title: 'payments.orders',
                path: paths.dashboard.user.order,
                info: !isLoadingNotificationSystem &&
                  (notificationSystem?.payment || 0) > 0 && (
                    <Label color="primary" variant="filled">
                      {notificationSystem?.payment || 0}
                    </Label>
                  ),
              },
              {
                title: 'payments.transactions',
                path: paths.dashboard.user.transaction,
              },
            ],
          },
          // PRODUCT
          // {
          //   title: t('product'),
          //   path: paths.dashboard.product.root,
          //   icon: ICONS.product,
          //   children: [
          //     { title: t('list'), path: paths.dashboard.product.root },
          //     { title: t('create'), path: paths.dashboard.product.new },
          //   ],
          // },

          // BLOG
          {
            title: 'blog',
            path: paths.dashboard.post.root,
            icon: ICONS.blog,
            roles: [permissions.POST_MANAGE],
            children: [
              { title: 'basic.list', path: paths.dashboard.post.root },
              { title: 'basic.create', path: paths.dashboard.post.new },
            ],
          },
          // FILE MANAGER
          {
            title: 'file_manager',
            path: paths.dashboard.fileManager,
            icon: ICONS.folder,
          },
        ],
      },

      // For Super Admin
      {
        subheader: 'basic.admin',
        items: [
          // EMAIL TEMPLATES
          {
            title: 'emails.template',
            path: paths.dashboard.email.root,
            icon: ICONS.emailTemplate,
            roles: [permissions.EMAIL_TEMPLATE_MANAGE],
            children: [
              { title: 'basic.list', path: paths.dashboard.email.root },
              {
                title: 'emails.send',
                path: paths.dashboard.email.send,
              },
            ],
          },
          {
            title: 'payments.label',
            path: paths.dashboard.payment.root,
            icon: ICONS.payment,
            roles: [permissions.PAYMENT_MANAGE],
            info: !isLoadingNotificationSystem &&
              notificationSystem &&
              (notificationSystem?.manage?.payment || 0) > 0 && (
                <Label color="primary" variant="filled">
                  {notificationSystem?.manage?.payment || 0}
                </Label>
              ),
            children: [
              {
                title: 'payments.orders',
                path: paths.dashboard.payment.root,
                info: !isLoadingNotificationSystem &&
                  notificationSystem &&
                  (notificationSystem?.manage?.payment || 0) > 0 && (
                    <Label color="primary" variant="filled">
                      {notificationSystem?.manage?.payment || 0}
                    </Label>
                  ),
              },
              {
                title: 'payments.transactions',
                path: paths.dashboard.payment.transaction,
              },
            ],
          },
        ],
      },
    ],
    [isLoadingNotificationSystem, notificationSystem, notificationUsers],
  );

  // deep filter data
  const filterData = () =>
    data.filter((group) => {
      const hasRole = checkNavDisplay(group, currentUser ?? undefined);
      if (!hasRole) return false;
      if (group.items) {
        group.items = group.items.filter((item) => {
          const hasRoleItem = checkNavDisplay(item, currentUser ?? undefined);
          if (!hasRoleItem) return false;
          if (item.children) {
            item.children = item.children.filter((child) => {
              const hasRoleChild = checkNavDisplay(
                child,
                currentUser ?? undefined,
              );
              if (!hasRoleChild) return false;

              return true;
            });
          }

          return true;
        });
      }

      return true;
    });

  // filter items empty
  const filterChildren = () =>
    filterData().filter((group) => group.items.length > 0);

  // filter children empty
  const finalData = () =>
    filterChildren().map((group) => {
      if (group.items) {
        group.items = group.items.filter((item) => {
          if (item.children) {
            return item.children.length > 0;
          }
          return true;
        });
      }
      return group;
    });

  return finalData();
}

function checkNavDisplay(
  { roles, levels }: { roles?: string[]; levels?: EUserLevel[] },
  currentUser?: IUser,
) {
  const checkRole = roles && roles.length > 0;
  const checkLevel = levels && levels.length > 0;
  if (!checkRole && !checkLevel) return true;
  if (!currentUser) return false;

  let hasRole = false;
  let hasLevel = false;
  if (checkRole) {
    if (!currentUser?.role || !currentUser?.role?.permissions) {
      hasRole = false;
    } else {
      hasRole = roles.some((role) =>
        currentUser?.role?.permissions?.includes(role),
      );
    }
  }

  if (levels && levels.length > 0) {
    if (!currentUser?.level) {
      hasLevel = false;
    } else {
      hasLevel = levels.includes(currentUser?.level);
    }
  }

  if (hasRole || hasLevel) return true;

  return false;
}
