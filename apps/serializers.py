from rest_framework import serializers
from apps.models import Config,Case,Step,Request

# 命名规范：模型名+Serializer
class RequestSerializer(serializers.ModelSerializer):  # 继承 Serializer
    class Meta:
        model = Request # 指定序列化器对应的模型
        # fields = ['step','method','url','params','headers'] # 指定序列化模型中的字段
        fields = '__all__' # 序列化所有字段
