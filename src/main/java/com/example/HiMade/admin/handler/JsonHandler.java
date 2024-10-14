package com.example.HiMade.admin.handler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class JsonHandler<T> extends BaseTypeHandler<T> {

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final Class<T> type;

    public JsonHandler(Class<T> type) {
        this.type = type;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, T parameter, JdbcType jdbcType) throws SQLException {
        try {
            // JSON 객체를 문자열로 변환
            String jsonString = objectMapper.writeValueAsString(parameter);
            // JSONB로 저장하기 위해 Types.OTHER 사용
            ps.setObject(i, jsonString, java.sql.Types.OTHER);
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON processing error: " + e.getMessage(), e);
        }
    }

    @Override
    public T getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String jsonString = rs.getString(columnName);
        return convertToType(jsonString);
    }

    @Override
    public T getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String jsonString = rs.getString(columnIndex);
        return convertToType(jsonString);
    }

    @Override
    public T getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String jsonString = cs.getString(columnIndex);
        return convertToType(jsonString);
    }

    private T convertToType(String jsonString) throws SQLException {
        if (jsonString == null) {
            return null;
        }
        try {
            return objectMapper.readValue(jsonString, type);
        } catch (JsonProcessingException e) {
            throw new SQLException("JSON processing error: " + e.getMessage(), e);
        }
    }
}
