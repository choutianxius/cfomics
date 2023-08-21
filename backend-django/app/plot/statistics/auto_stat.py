#! 建议服务器每一段时间（如一天、一周等）就自动运行一次此脚本，以实时更新数据的statistics情况。
import polars as pl
import pandas as pd
import pymysql
from tqdm import tqdm

# conn = pymysql.connect(
# 	host="",
# 	port=,
# 	user="",
# 	passwd="",
# 	db=''
# )
def auto_stat(conn):
    query = """
        SELECT ori.*, COUNT(*) as Cols
        FROM(
                SELECT *
                FROM (
                SELECT TABLE_NAME AS tablename,
                            SUBSTRING_INDEX(TABLE_NAME,'-',1) AS NT,
                            SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-6),'-',1) AS Omics,
                            SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-5),'-',1) AS Dataset,
                            SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-4),'-',1) AS Entity,
                            SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-3),'-',1) AS Disease_condition,
                            SUBSTRING_INDEX(SUBSTRING_INDEX(TABLE_NAME,'-',-2),'-',1) AS Specimen,
                            SUBSTRING_INDEX(TABLE_NAME,'-',-1) AS Value_type
                        FROM information_schema.`TABLES`
                        WHERE information_schema.`TABLES`.table_schema='exOmics'
                                AND (
                                                TABLE_NAME LIKE '%gse%'
                                OR TABLE_NAME LIKE '%prjeb%'
                                OR TABLE_NAME LIKE '%prjna%'
                                OR TABLE_NAME LIKE '%gse%'
                                OR TABLE_NAME LIKE '%srp%'
                                OR TABLE_NAME LIKE '%pxd%'
                                OR TABLE_NAME LIKE '%msv%'
                                        )
                                        AND TABLE_NAME NOT LIKE '%gsea%') ori
                WHERE ori.Entity NOT LIKE '%cgi%'
                    AND ori.Entity NOT LIKE '%promoter%'
                    AND ori.Entity NOT LIKE '%bin%'
                    AND ori.Entity NOT LIKE '%0%'
                    AND ori.Entity NOT LIKE '%c%'
                    AND ori.Entity NOT LIKE '%d%'
                    AND ori.Entity NOT LIKE '%f%'
                    AND ori.Entity NOT LIKE '%k%'
                    AND ori.Entity NOT LIKE '%o%'
                    AND ori.Entity NOT LIKE '%p%'
                    AND ori.Entity NOT LIKE '%s%'
                    AND ori.Entity NOT LIKE '%15t5%'
                    AND ori.Disease_condition NOT LIKE '%mean%'
                )ori, information_schema.`COLUMNS` col
        WHERE ori.tablename = col.table_name AND ori.Disease_condition NOT LIKE '%mean%'
        GROUP BY ori.tablename
    """
    df = pd.read_sql_query(query, conn)
    df = pl.from_pandas(df)

    # df.select(
    #     pl.col('Disease_condition').unique()
    # ).rename({'Disease_condition':'disease'}).join(cancer_con, on='disease', how='left').to_pandas()#.write_csv('con_disease_cancer.txt',has_header=True,sep='\t')

    df = df.with_columns(
        pl.when(
            pl.col('Omics').is_in(['snp','edit','itst'])
        )
        .then(
            pl.col('Cols')-2
        )
        .otherwise(
            pl.col('Cols')-1
        ).alias('sample')
    ).rename({
        'Dataset':'dataset',
        'Disease_condition':'disease',
        'Specimen':'specimen',
        'NT':'omics',
        'Omics':'feature',
    })

    # cancer_con = pl.read_csv('con_disease_cancer.txt',has_header=True,separator='\t')
    sql_cancer = """
        SELECT *
        FROM Is_disease_cancer
    """
    cancer_con = pl.from_pandas(pd.read_sql_query(sql_cancer, conn))

    # disease by sample
    df_disease = (df.select([
            pl.col('omics'),
            pl.col('dataset'),
            pl.col('disease'),
            pl.col('feature'),
            pl.col('sample')
        ])
        .groupby(['disease','feature','dataset']).agg([
            pl.col('sample').sum(), # omics
        ])
        .groupby(['dataset','disease']).agg([
            pl.all().exclude('feature').sort_by('sample').last() # feature是重复项，取最大
        ])
        .groupby('disease').agg([
            pl.col('sample').sum()
        ])
        .join(cancer_con,on='disease',how='left').select(
            pl.col('pre'),
            pl.col('disease'),
            pl.col('sample')
        )
    ).to_pandas()#.write_csv('statistics_disease_by_sample.txt',has_header=True,sep='\t')


    # disease by dataset
    df_da_disease = df.select([
        pl.col('dataset'),
        pl.col('disease')
    ]).unique().groupby('disease').agg([
        pl.col('dataset').count()
    ])
    df_da_disease = df_da_disease.join(cancer_con,on='disease').select(
        pl.col('pre'),
        pl.col('disease'),
        pl.col('dataset')
    ).to_pandas()#.write_csv('statistics_disease_by_dataset.txt',has_header=True,sep='\t')


    # specimen by sample 合并项：disease 重复项：feature
    df_specimen = df.select([
        pl.col('dataset'), #合并
        pl.col('specimen'),
        pl.col('feature'), #重复
        pl.col('disease'), #合并
        pl.col('sample')
    ]).groupby(['dataset','specimen','feature']).agg([
        pl.col('sample').sum()
    ]).groupby(['dataset','specimen']).agg([
        pl.all().exclude('feature').sort_by('sample').last()
    ]).groupby('specimen').agg([
        pl.col('sample').sum()
    ]).to_pandas()#.write_csv('statistics_specimen_by_sample.txt',has_header=True,sep='\t')

    # specimen by dataset
    df_da_specimen = df.select([
        pl.col('dataset'),
        pl.col('specimen')
    ]).unique().groupby('specimen').agg([
        pl.col('dataset').count()
    ]).to_pandas()
    #df_da_specimen.to_pandas()#.write_csv('statistics_specimen_by_dataset.txt',has_header=True,sep='\t')

    # feature by sample
    df_feature = df.select([
        pl.col('omics'),
        pl.col('dataset'),
        pl.col('feature'),
        pl.col('sample')
    ]).groupby(['omics','feature']).agg([
        pl.col('sample').sum() #disease dataset合并
    ]).select([
        pl.col('omics').alias('pre'),
        pl.col('feature'),
        pl.col('sample')
    ]).to_pandas()#.write_csv('statistics_feature_by_sample.txt',has_header=True,sep='\t')

    # # feature by dataset
    df_da_feature = df.select([
        pl.col('omics'),
        pl.col('dataset'),
        pl.col('feature')
    ]).unique().groupby(['omics','feature']).agg([
        pl.col('dataset').count()
    ])
    df_da_feature = df_da_feature.rename({'omics':'pre'}).to_pandas()#.write_csv('statistics_feature_by_dataset.txt',has_header=True,sep='\t')

    # dataset by sample
    df_dataset = df.select([
        pl.col('omics'),
        pl.col('dataset'),
        pl.col('feature'),
        pl.col('sample')
    ]).groupby(pl.col(['omics','dataset','feature'])).agg([
        pl.col('sample').sum() #把所有疾病类型样本加到一起 disease是合并项
    ]).groupby(pl.col('dataset')).agg([
        pl.all().sort_by('sample').last() #omics feature是重复项，取最大
    ]).select([
        pl.col('omics').alias('pre'),
        pl.col('dataset'),
        pl.col('sample')
    ]).to_pandas()#.write_csv('statistics_dataset_by_sample.txt',has_header=True,sep='\t')

    dataframes = {
        'df_disease': 'statistics_disease_by_sample',
        'df_da_disease': 'statistics_disease_by_dataset',
        'df_specimen': 'statistics_specimen_by_sample',
        'df_da_specimen': 'statistics_specimen_by_dataset',
        'df_feature': 'statistics_feature_by_sample',
        'df_da_feature': 'statistics_feature_by_dataset',
        'df_dataset': 'statistics_dataset_by_sample',
    }
    dfs = [df_disease, df_da_disease, df_specimen, df_da_specimen, df_feature, df_da_feature, df_dataset]

    def addquo(a):
        return '\''+str(a)+'\''

    try:
        with conn.cursor() as cursor:
            # Iterate over the DataFrames and table names
            i = 0
            for df, table_name in tqdm(dataframes.items(),total=7):
                # Convert DataFrame to a string of values for SQL insertion
                values = ', '.join(['(' + ', '.join(map(addquo, row)) + ')' for row in dfs[i].values])
                # values = ', '.join(['(' + ', '.join(map(str, row)) + ')' for row in dfs[dataframes[df]].values])

                # Create the REPLACE INTO statement to replace the existing table
                sql = f"""INSERT INTO {table_name}
                    VALUES {values}"""
                print(sql)

                # Execute the SQL statement
                cursor.execute(f"DELETE FROM {table_name}")
                conn.commit()
                cursor.execute(sql)
                conn.commit()

                print(f"Successfully uploaded DataFrame '{df}' to {table_name} table.")
                i += 1
        print("All DataFrames uploaded and tables replaced.")
    except pymysql.Error as e:
        print("Error uploading DataFrames and replacing tables:", e)
    finally:
        conn.close()
