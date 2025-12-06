import json
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    API для управления пользователями: регистрация, получение списка всех пользователей
    '''
    method: str = event.get('httpMethod', 'GET')
    
    cors_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
    }
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': cors_headers,
            'body': '',
            'isBase64Encoded': False
        }
    
    db_url = os.environ.get('DATABASE_URL')
    
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        if method == 'GET':
            cur.execute("""
                SELECT id, email, full_name, 
                       EXTRACT(YEAR FROM AGE(date_of_birth))::int as age,
                       phone, test_result, created_at
                FROM t_p86122027_youth_job_portal.users
                ORDER BY created_at DESC
            """)
            
            rows = cur.fetchall()
            users = []
            for row in rows:
                users.append({
                    'id': str(row[0]),
                    'email': row[1],
                    'name': row[2],
                    'age': row[3],
                    'phone': row[4],
                    'testResult': row[5],
                    'completedTest': bool(row[5]),
                    'createdAt': row[6].isoformat() if row[6] else None
                })
            
            return {
                'statusCode': 200,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({'users': users}),
                'isBase64Encoded': False
            }
        
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            email = body_data.get('email')
            password = body_data.get('password')
            name = body_data.get('name')
            age = body_data.get('age')
            phone = body_data.get('phone', '')
            
            cur.execute(
                "SELECT id FROM t_p86122027_youth_job_portal.users WHERE email = %s",
                (email,)
            )
            if cur.fetchone():
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'error': 'Email already exists'})
                }
            
            birth_year = datetime.now().year - age
            date_of_birth = f'{birth_year}-01-01'
            
            cur.execute("""
                INSERT INTO t_p86122027_youth_job_portal.users 
                (email, password_hash, full_name, date_of_birth, phone, created_at, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW(), NOW())
                RETURNING id
            """, (email, password, name, date_of_birth, phone))
            
            user_id = cur.fetchone()[0]
            conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {**cors_headers, 'Content-Type': 'application/json'},
                'body': json.dumps({
                    'id': str(user_id),
                    'email': email,
                    'name': name,
                    'age': age,
                    'phone': phone,
                    'completedTest': False
                }),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': cors_headers,
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {**cors_headers, 'Content-Type': 'application/json'},
            'body': json.dumps({'error': str(e)}),
            'isBase64Encoded': False
        }
    
    finally:
        if 'cur' in locals():
            cur.close()
        if 'conn' in locals():
            conn.close()