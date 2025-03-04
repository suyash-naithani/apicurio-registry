/*
 * Copyright 2020 Red Hat
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

package io.apicurio.registry.ccompat.dto;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.JsonProperty;

import io.quarkus.runtime.annotations.RegisterForReflection;
import lombok.*;

import static com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility.NONE;

/**
 * @author Carles Arnal 'carles.arnal@redhat.com'
 */
@JsonAutoDetect(isGetterVisibility = NONE)
@Getter
@EqualsAndHashCode
@ToString
@Builder
@RegisterForReflection
public class SchemaInfo {

    @JsonProperty("schema")
    private String schema;

    @JsonProperty("schemaType")
    @Builder.Default
    private String schemaType = "AVRO";


    public SchemaInfo(String schema, String schemaType) {
        this.schema = schema;
        this.schemaType = schemaType;
    }

    public SchemaInfo(String schema) {
        this.schema = schema;
    }

    public SchemaInfo() {
    }
}
