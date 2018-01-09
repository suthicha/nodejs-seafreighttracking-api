// -----------------------------------------------
// author: Suthicha Poonakaow
// date: 2018.01.05 
// description: Helper to create sql command text.
// email: <isuthicha@gmail.com>
// -----------------------------------------------
var squel = require('squel')


// -----------------------------------------------
// Create query shipment command text.
// -----------------------------------------------
exports.createFindShipmentByEtdCommandText = (etd) => {
    return squel.select()
    .from("SEBL1")
    .field("TrxNo")
    .field("ISNULL((SELECT TOP 1 VatRegistrationNo FROM slcu1 WHERE slcu1.CustomerCode=SEBL1.CustomerCode),'') AS TaxNo")
    .field("'' AS BranchNo")
    .field("ISNULL(JobNo,'') AS JobNo")
    .field("ISNULL(BookingNo,'') AS BookingNo")
    .field("ISNULL(CustomerCode,'') AS CustomerNo")
    .field("ISNULL(CustomerName,'') AS CustomerName")
    .field("ISNULL(UcrNo,'') AS CarrierBookingNo")
    .field("ISNULL(OBLNo,'') AS OBL")
    .field("ISNULL(BLNo,'') AS HBL")
    .field("ISNULL(MasterJobNo,'') AS MasterJobNo")
    .field("ISNULL(DestCode,'') AS DestCode")
    .field("ISNULL(DestName,'') AS DestName")
    .field("ISNULL(EtdDate, CONVERT(DATE,'19000101',112)) AS DepartureDate")
    .field("ISNULL(MotherVesselName,'') AS MotherVessel")
    .field("ISNULL(FeederVesselName,'') AS FeederVessel")
    .field("ISNULL(EtaDate, CONVERT(DATE,'19000101',112)) AS ArrivalDate")
    .field("ISNULL(ContainerNo,'') AS ContainerNo")
    .field("ISNULL(DeliveryOrderReleaseDate, CONVERT(DATE,'19000101',112)) AS DeliveryDate")
    .field("ISNULL(PortOfDischargeCode,'') AS PortOfDischargeCode")
    .field("ISNULL(PortOfDischargeName,'') AS PortOfDischargeName")
    .field("ISNULL(PortOfLoadingCode,'') AS PortOfLoadingCode")
    .field("ISNULL(PortOfLoadingName,'') AS PortOfLoadingName")
    .field("ISNULL(VoyageNo,'') AS VoyageNo")
    .field("'' AS Status")
    .field("'' AS Remark")
    .field("'' AS Username")
    .where("ISNULL(EtdDate, CONVERT(DATE,'19000101',112)) = ?", etd)
    .order("EtdDate")
    .order("MasterJobNo")
    .toString()
}

// -----------------------------------------------
// find order with booking job
// -----------------------------------------------
exports.createFindShipmentByRefCommandText = (refno) => {
    return squel.select()
    .from("SEBL1")
    .field("TrxNo")
    .field("ISNULL((SELECT TOP 1 VatRegistrationNo FROM slcu1 WHERE slcu1.CustomerCode=SEBL1.CustomerCode),'') AS TaxNo")
    .field("'' AS BranchNo")
    .field("ISNULL(JobNo,'') AS JobNo")
    .field("ISNULL(BookingNo,'') AS BookingNo")
    .field("ISNULL(CustomerCode,'') AS CustomerNo")
    .field("ISNULL(CustomerName,'') AS CustomerName")
    .field("ISNULL(UcrNo,'') AS CarrierBookingNo")
    .field("ISNULL(OBLNo,'') AS OBL")
    .field("ISNULL(BLNo,'') AS HBL")
    .field("ISNULL(MasterJobNo,'') AS MasterJobNo")
    .field("ISNULL(DestCode,'') AS DestCode")
    .field("ISNULL(DestName,'') AS DestName")
    .field("ISNULL(EtdDate, CONVERT(DATE,'19000101',112)) AS DepartureDate")
    .field("ISNULL(MotherVesselName,'') AS MotherVessel")
    .field("ISNULL(FeederVesselName,'') AS FeederVessel")
    .field("ISNULL(EtaDate, CONVERT(DATE,'19000101',112)) AS ArrivalDate")
    .field("ISNULL(ContainerNo,'') AS ContainerNo")
    .field("ISNULL(DeliveryOrderReleaseDate, CONVERT(DATE,'19000101',112)) AS DeliveryDate")
    .field("ISNULL(PortOfDischargeCode,'') AS PortOfDischargeCode")
    .field("ISNULL(PortOfDischargeName,'') AS PortOfDischargeName")
    .field("ISNULL(PortOfLoadingCode,'') AS PortOfLoadingCode")
    .field("ISNULL(PortOfLoadingName,'') AS PortOfLoadingName")
    .field("ISNULL(VoyageNo,'') AS VoyageNo")
    .field("'' AS Status")
    .field("'' AS Remark")
    .field("'' AS Username")
    .where(
      squel.expr()
        .and(
            squel.expr()
            .or("MasterJobNo = ?", refno)
            .or("OBLNo = ?", refno)
            .or("BookingNo = ?", refno)
        )
    )
    .toString()
}


