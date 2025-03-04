/**
 * @license
 * Copyright 2020 JBoss Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import React from 'react';
import "./toolbar.css";
import {
    Button,
    ButtonVariant,
    Dropdown,
    DropdownItem,
    DropdownToggle,
    Form,
    InputGroup,
    Pagination,
    TextInput,
    Toolbar,
    ToolbarContent,
    ToolbarItem
} from '@patternfly/react-core';
import {SearchIcon, SortAlphaDownAltIcon, SortAlphaDownIcon} from "@patternfly/react-icons";
import {IfAuth, IfFeature, PureComponent, PureComponentProps, PureComponentState} from "../../../../components";
import {OnPerPageSelect, OnSetPage} from "@patternfly/react-core/dist/js/components/Pagination/Pagination";
import {ArtifactsSearchResults, GetArtifactsCriteria, Paging, Services} from "../../../../../services";

/**
 * Properties
 */
export interface ArtifactsPageToolbarProps extends PureComponentProps {
    artifacts: ArtifactsSearchResults;
    onChange: (criteria: GetArtifactsCriteria) => void
    paging: Paging;
    onPerPageSelect: OnPerPageSelect;
    onSetPage: OnSetPage;
    onUploadArtifact: () => void;
}

/**
 * State
 */
export interface ArtifactsPageToolbarState extends PureComponentState {
    filterIsExpanded: boolean;
    filterSelection: string;
    filterValue: string;
    ascending: boolean;
}

/**
 * Models the toolbar for the Artifacts page.
 */
export class ArtifactsPageToolbar extends PureComponent<ArtifactsPageToolbarProps, ArtifactsPageToolbarState> {

    constructor(props: Readonly<ArtifactsPageToolbarProps>) {
        super(props);
    }

    public render(): React.ReactElement {
        return (
            <Toolbar id="artifacts-toolbar-1" className="artifacts-toolbar">
                <ToolbarContent>
                    <ToolbarItem className="filter-item">
                        <Form onSubmit={this.onFilterSubmit}>
                            <InputGroup>
                                <Dropdown
                                    onSelect={this.onFilterSelect}
                                    toggle={
                                        <DropdownToggle data-testid="toolbar-filter-toggle" onToggle={this.onFilterToggle}>{this.filterValueDisplay()}</DropdownToggle>
                                    }
                                    isOpen={this.state.filterIsExpanded}
                                    dropdownItems={[
                                        <DropdownItem key="name" id="name" data-testid="toolbar-filter-name" component="button">Name</DropdownItem>,
                                        <DropdownItem key="group" id="group" data-testid="toolbar-filter-group" component="button">Group</DropdownItem>,
                                        <DropdownItem key="description" id="description" data-testid="toolbar-filter-description" component="button">Description</DropdownItem>,
                                        <DropdownItem key="labels" id="labels" data-testid="toolbar-filter-labels" component="button">Labels</DropdownItem>,
                                    ]}
                                />
                                <TextInput name="filterValue" id="filterValue" type="search"
                                           onChange={this.onFilterValueChange}
                                           data-testid="toolbar-filter-value"
                                           aria-label="search input example"/>
                                <Button variant={ButtonVariant.control}
                                        onClick={this.onFilterSubmit}
                                        data-testid="toolbar-btn-filter-search"
                                        aria-label="search button for search input">
                                    <SearchIcon/>
                                </Button>
                            </InputGroup>
                        </Form>
                    </ToolbarItem>
                    <ToolbarItem className="sort-icon-item">
                        <Button variant="plain" aria-label="edit" data-testid="toolbar-btn-sort" onClick={this.onToggleAscending}>
                            {
                                this.state.ascending ? <SortAlphaDownIcon/> : <SortAlphaDownAltIcon/>
                            }
                        </Button>
                    </ToolbarItem>
                    <ToolbarItem className="upload-artifact-item">
                        <IfAuth isDeveloper={true}>
                            <IfFeature feature="readOnly" isNot={true}>
                                <Button className="btn-header-upload-artifact" data-testid="btn-header-upload-artifact"
                                        variant="primary" onClick={this.props.onUploadArtifact}>Upload artifact</Button>
                            </IfFeature>
                        </IfAuth>
                    </ToolbarItem>
                    <ToolbarItem className="artifact-paging-item">
                        <Pagination
                            variant="bottom"
                            dropDirection="down"
                            itemCount={this.totalArtifactsCount()}
                            perPage={this.props.paging.pageSize}
                            page={this.props.paging.page}
                            onSetPage={this.props.onSetPage}
                            onPerPageSelect={this.props.onPerPageSelect}
                            widgetId="artifact-list-pagination"
                            className="artifact-list-pagination"
                        />
                    </ToolbarItem>
                </ToolbarContent>
            </Toolbar>
        );
    }

    protected initializeState(): ArtifactsPageToolbarState {
        return {
            ascending: true,
            filterIsExpanded: false,
            filterSelection: "name",
            filterValue: ""
        };
    }

    private totalArtifactsCount(): number {
        return this.props.artifacts ? this.props.artifacts.count : 0;
    }

    private onFilterToggle = (isExpanded: boolean): void => {
        Services.getLoggerService().debug("[ArtifactsPageToolbar] Toggling filter dropdown.");
        this.setSingleState("filterIsExpanded", isExpanded);
    };

    private onFilterSelect = (event: React.SyntheticEvent<HTMLDivElement>|undefined): void => {
        const value: string = event && event.currentTarget && event.currentTarget.id ? event.currentTarget.id : "";
        Services.getLoggerService().debug("[ArtifactsPageToolbar] Setting filter type to: %s", value);
        this.setState({
            filterIsExpanded: false,
            filterSelection: value
        }, () => {
            this.fireOnChange();
        });
    };

    private onFilterValueChange = (value: any): void => {
        Services.getLoggerService().debug("[ArtifactsPageToolbar] Setting filter value: %o", value);
        this.setSingleState("filterValue", value);
    };

    private onFilterSubmit = (event: any|undefined): void => {
        Services.getLoggerService().debug("[ArtifactsPageToolbar] Filter SUBMIT!");
        this.fireOnChange();
        if (event) {
            event.preventDefault();
        }
    };

    private onToggleAscending = (): void => {
        Services.getLoggerService().debug("[ArtifactsPageToolbar] Toggle the ascending flag.");
        const sortAscending: boolean = !this.state.ascending;
        this.setSingleState("ascending", sortAscending, () => {
            this.fireOnChange();
        });
    };

    private fireOnChange(): void {
        if (this.props.onChange) {
            const criteria: GetArtifactsCriteria = {
                sortAscending: this.state.ascending,
                type: this.state.filterSelection,
                value: this.state.filterValue
            };

            this.props.onChange(criteria);
        }
    }

    private filterValueDisplay(): string {
        switch (this.state.filterSelection) {
            case "name":
                return "Name";
            case "group":
                return "Group";
            case "description":
                return "Description";
            case "labels":
                return "Labels";
            default:
                return "Name";
        }
    }
}
