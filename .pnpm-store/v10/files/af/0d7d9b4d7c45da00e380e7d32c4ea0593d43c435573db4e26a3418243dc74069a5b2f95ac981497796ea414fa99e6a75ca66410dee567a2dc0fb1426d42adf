import { JSONSerializable } from '../../../util/json';
import { AccAddress } from '../../bech32';
import { Any } from '@initia/initia.proto/google/protobuf/any';
import { Order } from '@initia/initia.proto/ibc/core/channel/v1/channel';
import { MsgRegisterAccount as MsgRegisterAccount_pb } from '@initia/initia.proto/initia/intertx/v1/tx';
export declare class MsgRegisterAccount extends JSONSerializable<MsgRegisterAccount.Amino, MsgRegisterAccount.Data, MsgRegisterAccount.Proto> {
    owner: AccAddress;
    connection_id: string;
    version: string;
    ordering: Order;
    constructor(owner: AccAddress, connection_id: string, version: string, ordering: Order);
    static fromAmino(data: MsgRegisterAccount.Amino): MsgRegisterAccount;
    toAmino(): MsgRegisterAccount.Amino;
    static fromData(data: MsgRegisterAccount.Data): MsgRegisterAccount;
    toData(): MsgRegisterAccount.Data;
    static fromProto(proto: MsgRegisterAccount.Proto): MsgRegisterAccount;
    toProto(): MsgRegisterAccount.Proto;
    packAny(): Any;
    static unpackAny(msgAny: Any): MsgRegisterAccount;
}
export declare namespace MsgRegisterAccount {
    interface Amino {
        type: 'intertx/MsgRegisterAccount';
        value: {
            owner: AccAddress;
            connection_id: string;
            version: string;
            ordering: Order;
        };
    }
    interface Data {
        '@type': '/initia.intertx.v1.MsgRegisterAccount';
        owner: AccAddress;
        connection_id: string;
        version: string;
        ordering: Order;
    }
    type Proto = MsgRegisterAccount_pb;
}
