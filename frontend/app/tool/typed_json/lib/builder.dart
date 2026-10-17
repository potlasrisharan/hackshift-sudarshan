import 'package:analyzer/dart/element/element.dart';
import 'package:build/build.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:json_serializable/json_serializable.dart';
import 'package:source_gen/source_gen.dart';

/// Preserve json_serializable's field/schema handling while using Object? at
/// the JSON boundary, so generated DTOs obey the application's strict types.
class TypedJsonGenerator extends GeneratorForAnnotation<JsonSerializable> {
  @override
  Iterable<String> generateForAnnotatedElement(
    // json_serializable 6.9 requires analyzer's legacy element model here.
    // ignore: deprecated_member_use
    Element element,
    ConstantReader annotation,
    BuildStep buildStep,
  ) => JsonSerializableGenerator()
      .generateForAnnotatedElement(element, annotation, buildStep)
      .map((source) => source.replaceAll(RegExp(r'\bdynamic\b'), 'Object?'));
}

Builder typedJson(BuilderOptions options) =>
    SharedPartBuilder([TypedJsonGenerator()], 'typed_json');
