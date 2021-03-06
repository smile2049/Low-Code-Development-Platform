
import { getAsyncTypes } from '../helpers/actionType'
import * as AdmReleaseService from '../services/AdmReleaseService'
import { RintagiScreenRedux, initialRintagiScreenReduxState } from './_ScreenReducer'
const Label = {
  PostToAp: 'Post to AP',
}
class AdmReleaseRedux extends RintagiScreenRedux {
  allowTmpDtl = false;
  constructor() {
    super();
    this.ActionApiNameMapper = {
      'GET_SEARCH_LIST': 'GetAdmRelease98List',
      'GET_MST': 'GetAdmRelease98ById',
      'GET_DTL_LIST': 'GetAdmRelease98DtlById',
    }
    this.ScreenDdlDef = [
      { columnName: 'ReleaseOs191', payloadDdlName: 'ReleaseOs191List', keyName: 'ReleaseOs191', labelName: 'ReleaseOs191Text', forMst: true, isAutoComplete: false, apiServiceName: 'GetReleaseOs191List', actionTypeName: 'GET_DDL_ReleaseOs191' },
      { columnName: 'EntityId191', payloadDdlName: 'EntityId191List', keyName: 'EntityId191', labelName: 'EntityId191Text', forMst: true, isAutoComplete: false, apiServiceName: 'GetEntityId191List', actionTypeName: 'GET_DDL_EntityId191' },
      { columnName: 'ReleaseTypeId191', payloadDdlName: 'ReleaseTypeId191List', keyName: 'ReleaseTypeId191', labelName: 'ReleaseTypeId191Text', forMst: true, isAutoComplete: false, apiServiceName: 'GetReleaseTypeId191List', actionTypeName: 'GET_DDL_ReleaseTypeId191' },
      { columnName: 'ObjectType192', payloadDdlName: 'ObjectType192List', keyName: 'ObjectType192', labelName: 'ObjectType192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetObjectType192List', actionTypeName: 'GET_DDL_ObjectType192' },
      { columnName: 'SProcOnly192', payloadDdlName: 'SProcOnly192List', keyName: 'SProcOnly192', labelName: 'SProcOnly192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetSProcOnly192List', actionTypeName: 'GET_DDL_SProcOnly192' },
      { columnName: 'SrcClientTierId192', payloadDdlName: 'SrcClientTierId192List', keyName: 'SrcClientTierId192', labelName: 'SrcClientTierId192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetSrcClientTierId192List', actionTypeName: 'GET_DDL_SrcClientTierId192' },
      { columnName: 'SrcRuleTierId192', payloadDdlName: 'SrcRuleTierId192List', keyName: 'SrcRuleTierId192', labelName: 'SrcRuleTierId192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetSrcRuleTierId192List', actionTypeName: 'GET_DDL_SrcRuleTierId192' },
      { columnName: 'SrcDataTierId192', payloadDdlName: 'SrcDataTierId192List', keyName: 'SrcDataTierId192', labelName: 'SrcDataTierId192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetSrcDataTierId192List', actionTypeName: 'GET_DDL_SrcDataTierId192' },
      { columnName: 'TarDataTierId192', payloadDdlName: 'TarDataTierId192List', keyName: 'TarDataTierId192', labelName: 'TarDataTierId192Text', forMst: false, isAutoComplete: false, apiServiceName: 'GetTarDataTierId192List', actionTypeName: 'GET_DDL_TarDataTierId192' },
    ]
    this.ScreenOnDemandDef = [

    ]
    this.ScreenDocumentDef = [

    ]
    this.ScreenCriDdlDef = [
      
      { columnName: 'EntityId20', payloadDdlName: 'EntityId20List', keyName: 'EntityId', labelName: 'EntityName', isCheckBox:false, isAutoComplete: false, apiServiceName: 'GetScreenCriEntityId20List', actionTypeName: 'GET_DDL_CRIEntityId20' },
      { columnName: 'ReleaseTypeId30', payloadDdlName: 'ReleaseTypeId30List', keyName: 'ReleaseTypeId', labelName: 'ReleaseTypeName', isCheckBox:false, isAutoComplete: false, apiServiceName: 'GetScreenCriReleaseTypeId30List', actionTypeName: 'GET_DDL_CRIReleaseTypeId30' },
    ]
    this.SearchActions = {
      ...[...this.ScreenDdlDef].reduce((a, v) => { a['Search' + v.columnName] = this.MakeSearchAction(v); return a; }, {}),
      ...[...this.ScreenCriDdlDef].reduce((a, v) => { a['SearchCri' + v.columnName] = this.MakeSearchAction(v); return a; }, {}),
      ...[...this.ScreenOnDemandDef].filter(f => f.type !== 'DocList' && f.type !== 'RefColumn').reduce((a, v) => { a['Get' + v.columnName] = this.MakeGetColumnOnDemandAction(v); return a; }, {}),
      ...[...this.ScreenOnDemandDef].filter(f => f.type === 'RefColumn').reduce((a, v) => { a['Get' + v.columnName] = this.MakeGetRefColumnOnDemandAction(v); return a; }, {}),
      ...this.MakePullUpOnDemandAction([...this.ScreenOnDemandDef].filter(f => f.type === 'RefColumn').reduce((a, v) => { a['GetRef' + v.refColumnName] = { dependents: [...((a['GetRef' + v.refColumnName] || {}).dependents || []), v] }; return a; }, {})),
      ...[...this.ScreenOnDemandDef].filter(f => f.type === 'DocList').reduce((a, v) => { a['Get' + v.columnName] = this.MakeGetDocumentListAction(v); return a; }, {}),
    }
    this.OnDemandActions = {
      ...[...this.ScreenDocumentDef].filter(f => f.type === 'Get').reduce((a, v) => { a['Get' + v.columnName + 'Content'] = this.MakeGetDocumentContentAction(v); return a; }, {}),
      ...[...this.ScreenDocumentDef].filter(f => f.type === 'Add').reduce((a, v) => { a['Add' + v.columnName + 'Content'] = this.MakeAddDocumentContentAction(v); return a; }, {}),
      ...[...this.ScreenDocumentDef].filter(f => f.type === 'Del').reduce((a, v) => { a['Del' + v.columnName + 'Content'] = this.MakeDelDocumentContentAction(v); return a; }, {}),
    }
    this.ScreenDdlSelectors = this.ScreenDdlDef.reduce((a, v) => { a[v.columnName] = this.MakeDdlSelectors(v); return a; }, {})
    this.ScreenCriDdlSelectors = this.ScreenCriDdlDef.reduce((a, v) => { a[v.columnName] = this.MakeCriDdlSelectors(v); return a; }, {})
    this.actionReducers = this.MakeActionReducers();
  }
  GetScreenName() { return 'AdmRelease' }
  GetMstKeyColumnName(isUnderlining = false) { return isUnderlining ? 'ReleaseId' : 'ReleaseId191'; }
  GetDtlKeyColumnName(isUnderlining = false) { return isUnderlining ? 'ReleaseDtlId' : 'ReleaseDtlId192'; }
  GetPersistDtlName() { return this.GetScreenName() + '_Dtl'; }
  GetPersistMstName() { return this.GetScreenName() + '_Mst'; }
  GetWebService() { return AdmReleaseService; }
  GetReducerActionTypePrefix() { return this.GetScreenName(); };
  GetActionType(actionTypeName) { return getAsyncTypes(this.GetReducerActionTypePrefix(), actionTypeName); }
  GetInitState() {
    return {
      ...initialRintagiScreenReduxState,
      Label: {
        ...initialRintagiScreenReduxState.Label,
        ...Label,
      }
    }
  };

  GetDefaultDtl(state) {
    return (state || {}).NewDtl ||
    {
      ReleaseDtlId192: null,
      ObjectType192: null,
      RunOrder192: null,
      SrcObject192: null,
      SProcOnly192: null,
      ObjectName192: null,
      ObjectExempt192: null,
      SrcClientTierId192: null,
      SrcRuleTierId192: null,
      SrcDataTierId192: null,
      TarDataTierId192: null,
      DoSpEncrypt192: null,
    }
  }
  ExpandMst(mst, state, copy) {
    return {
      ...mst,
      key: Date.now(),
      ReleaseId191: copy ? null : mst.ReleaseId191,
    }
  }
  ExpandDtl(dtlList, copy) {
    if (!copy) return dtlList;
    else if (!this.allowTmpDtl) return [];
    else {
      const now = Date.now();
      return dtlList.map((v, i) => {
        return {
          ...v,
          ReleaseId191: null,
          ReleaseDtlId192: null,
          TmpKeyId: now + i,
        }
      })
    };
  }

  SearchListToSelectList(state) {
    const searchList = ((state || {}).SearchList || {}).data || [];
    return searchList
      .map((v, i) => {
        return {
          key: v.key || null,
          value: v.labelL || v.label || ' ',
          label: v.labelL || v.label || ' ',
          labelR: v.labelR || ' ',
          detailR: v.detailR,
          detail: v.detail || '',
          idx: i,
          isSelected: v.isSelected,
        }
      })
  }
}

/* ReactRule: Redux Custom Function */

/* ReactRule End: Redux Custom Function */

/* helper functions */

export function ShowMstFilterApplied(state) {
  return !state
    || !state.ScreenCriteria
    || (state.ScreenCriteria.ReleaseDate10 || {}).LastCriteria
    || (state.ScreenCriteria.EntityId20 || {}).LastCriteria
    || (state.ScreenCriteria.ReleaseTypeId30 || {}).LastCriteria
    || state.ScreenCriteria.SearchStr;
}

export default new AdmReleaseRedux()
