import {
  BSONDeserializer,
  BSONSerializer,
  getBSONDeserializer,
  getBSONSerializer,
} from '@deepkit/bson';
import { TypeObjectLiteral } from '@deepkit/type';

const VALUE_KEY = 'v' as const;

export function getActionResponseSerializer(
  type: TypeObjectLiteral,
): BSONSerializer {
  const serialize = getBSONSerializer(undefined, type);
  return (value: unknown) => serialize({ [VALUE_KEY]: value });
}

export function serializeActionResponse(
  data: unknown,
  type: TypeObjectLiteral,
): Uint8Array {
  const serialize = getActionResponseSerializer(type);
  return serialize(data);
}

export function getActionResponseDeserializer<T>(
  type: TypeObjectLiteral,
): BSONDeserializer<T> {
  const deserialize = getBSONDeserializer<{ readonly [VALUE_KEY]: T }>(
    undefined,
    type,
  );
  return (bson: Uint8Array) => deserialize(bson)[VALUE_KEY];
}

export function deserializeActionResponse<T>(
  data: Uint8Array,
  type: TypeObjectLiteral,
): T {
  const deserialize = getActionResponseDeserializer<T>(type);
  return deserialize(data);
}
