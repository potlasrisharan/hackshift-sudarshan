class PatientModel {
  final String patientId;
  final String abhaNumber;
  final String abhaAddress;
  final String name;
  final String gender;
  final int age;
  final String phone;
  final String address;
  final bool pmjayEligible;
  final double pmjayCoverageAmount;

  PatientModel({
    required this.patientId,
    required this.abhaNumber,
    required this.abhaAddress,
    required this.name,
    required this.gender,
    required this.age,
    required this.phone,
    required this.address,
    this.pmjayEligible = true,
    this.pmjayCoverageAmount = 500000.0,
  });
}
