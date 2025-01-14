import { FC, useEffect } from "react";
import { useMutation, useQueryClient } from "react-query";
import { MenuComponent } from "../../../../../../../_metronic/assets/ts/components";
import { ID, Iqama, KTIcon, QUERIES } from "../../../../../../../_metronic/helpers";
import { useListView } from "../../core/ListViewProvider";
import { useIqamaListView } from "../../core/IqamaListViewProvider";
import { useQueryResponse } from "../../core/QueryResponseProvider";
import { deleteUser } from "../../core/_requests";
import { useNavigate } from "react-router-dom";

type Props = {
  id: ID;
  iqama: Iqama;
};

const UserActionsCell: FC<Props> = ({ id, iqama }) => {
  const { setItemIdForUpdate } = useListView();
  const { setItemIqamaForUpdate } = useIqamaListView();
  const { query } = useQueryResponse();
  const queryClient = useQueryClient();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const openEditModal = () => {
    console.log("ID")
    setItemIdForUpdate(id);
  };

  const openIqamaEditModel = () => {
    setItemIqamaForUpdate(iqama);
  }

  const deleteItem = useMutation(() => deleteUser(id), {
    // 💡 response of the mutation is passed to onSuccess
    onSuccess: () => {
      // ✅ update detail view directly
      queryClient.invalidateQueries([`${QUERIES.USERS_LIST}-${query}`]);
    },
  });
  const routeToUserDetails = () => {
    const navigate = useNavigate();
    //let path = "../../../../../profile/components/Campaigns"
    let path = "/apps/user-management/*";
    navigate(path);
  };
  return (
    <>
      <a
        href="#"
        className="btn btn-light btn-active-light-primary btn-sm"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        Actions
        <KTIcon iconName="down" className="fs-5 m-0" />
      </a>
      {/* begin::Menu */}
      <div
        className="menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg-light-primary fw-bold fs-7 w-125px py-4"
        data-kt-menu="true"
      >
        {/* begin::Menu item */}
        <div className="menu-item px-3">
          <a className="menu-link px-3" onClick={openEditModal}>
            Payslip
          </a>
        </div>
        {/* end::Menu item */}

         {/* begin::Menu item */}
         <div className="menu-item px-3"> 
          <a className="menu-link px-3" onClick={openIqamaEditModel} >
            Iqama Expiry
          </a>
        </div>
        {/* end::Menu item */}

         {/* begin::Menu item */}
         <div className="menu-item px-3">
          <a className="menu-link px-3" >
           Contract Exp
          </a>
        </div>
        {/* end::Menu item */}

        {/* begin::Menu item */}
        {
          <div className="menu-item px-3">
            <a
              className="menu-link px-3"
              data-kt-users-table-filter="delete_row"
              onClick={(event) => (window.location.href = "IOTADashboard/crafted/pages/profile/campaigns")}
            >
              Details
            </a>
          </div>
        }
        {/* end::Menu item */}
      </div>
      {/* end::Menu */}
    </>
  );
};

export { UserActionsCell };
