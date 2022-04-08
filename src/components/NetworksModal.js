import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import { produce, current } from "immer";
import "../styles/MuiOverride.css";
import "react-notifications-component/dist/theme.css";
import { useRecoilState } from "recoil";
import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min";
// import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
// import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import {
  NetworksAndDevicesState,
  openNetworksModalState,
  notificationMessageState,
  notificationTypeState,
  triggerShowNotificationState,
} from "../main/GlobalState";

export default function NetworksModal(ac) {
  const [NetworksAndDevices, setNetworksAndDevices] = useRecoilState(NetworksAndDevicesState);
  const [openNetworksModal, setopenNetworksModal] = useRecoilState(openNetworksModalState);
  const [notificationMessage, setnotificationMessage] = useRecoilState(notificationMessageState);
  const [notificationType, setnotificationType] = useRecoilState(notificationTypeState);
  const [triggerShowNotification, settriggerShowNotification] = useRecoilState(triggerShowNotificationState);
  const { SearchBar } = Search;

  const handleCloseModal = () => {
    setopenNetworksModal(!openNetworksModal);
  };

  // ----------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------

  let newData = [];
  let newColumn = [];
  if (NetworksAndDevices.networks.length > 0) {
    NetworksAndDevices.networks.map((opt, index) => {
      let RowsModel = {};
      Object.entries(opt).map((opt1) => {
        RowsModel[opt1[0]] = opt1[1];
      });

      newData.push(RowsModel);
    });

    Object.entries(NetworksAndDevices.networks[0]).map((opt) => {
      let ColumnModel = {};
      if (opt[0] === "enrollmentString" || opt[0] === "url" || opt[0] === "tags") {
        ColumnModel = {
          label: opt[0],
          value: opt[0],
          dataField: opt[0],
          text: opt[0],
          hidden: true,
        };
      } else {
        ColumnModel = {
          label: opt[0],
          value: opt[0],
          dataField: opt[0],
          sort: true,
          text: opt[0],
          editable: false,
          style: () => {
            return {
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textAlign: "center",
              fontSite: "13px",
            };
          },
        };
      }

      newColumn.push(ColumnModel);
    });
  }

  const selectRow = {
    mode: "checkbox",
    selected: ac.dc.networksIDSelected,
    clickToSelect: true,
    style: { backgroundColor: "#17a2b80f" },
    onSelect: (row, isSelect) => {
      if (isSelect === true) {
        ac.dc.setnetworksSelected([...ac.dc.networksSelected, row]);
        setnotificationMessage(["Network selected", `ID: ${row.id}`, `Name: ${row.name}`]);
        setnotificationType("info");
        settriggerShowNotification(!triggerShowNotification);
      } else if (isSelect === false) {
        const index = ac.dc.networksSelected.findIndex((i) => i.id === row.id);
        const removeRow = produce(ac.dc.networksSelected, (draft) => {
          draft = draft.splice(index, 1);
        });
        ac.dc.setnetworksSelected(removeRow);
        setnotificationMessage(["Network removed", `ID: ${row.id}`, `Name: ${row.name}`]);
        setnotificationType("info");
        settriggerShowNotification(!triggerShowNotification);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect === true) {
        ac.dc.setnetworksSelected(rows);
        setnotificationMessage([`${rows.length} networks selected`]);
        setnotificationType("info");
        settriggerShowNotification(!triggerShowNotification);
      } else if (isSelect === false) {
        ac.dc.setnetworksSelected([]);
        setnotificationMessage([`${rows.length} networks removed`]);
        setnotificationType("info");
        settriggerShowNotification(!triggerShowNotification);
      }
    },
  };

  return (
    <Dialog open={openNetworksModal} fullWidth maxWidth={"False"} onClose={handleCloseModal}>
      <div className="modal-header">
        <h4 className="modal-title">Networks</h4>
        <DialogActions>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={handleCloseModal}>
            <span aria-hidden="true">&times;</span>
          </button>
        </DialogActions>
      </div>
      <div className="modal-body">
        {NetworksAndDevices.networks.length > 0 ? (
          <ToolkitProvider search keyField="id" data={newData} columns={newColumn}>
            {(props) => (
              <div>
                <SearchBar style={{ width: "299px" }} {...props.searchProps} />
                <BootstrapTable
                  // eslint-disable-next-line
                  {...props.baseProps}
                  bootstrap4
                  striped
                  hover
                  selectRow={selectRow}
                />
              </div>
            )}
          </ToolkitProvider>
        ) : (
          <div className="page-content empty-table" style={{ position: "relative" }}>
            <div className="container text-center">
              <div className="display-1 text-muted mb-5">
                <i className="fa fa-database" aria-hidden="true"></i>
              </div>
              <h1 className="h2 mb-3">Oops.. We did not find any network..</h1>
            </div>
          </div>
        )}
      </div>

      <div className="modal-footer">
        <DialogActions>
          <button type="button" className="btn btn-default" data-dismiss="modal" onClick={handleCloseModal}>
            Close
          </button>
        </DialogActions>
      </div>
    </Dialog>
  );
}
