from django.db.models import Q, IntegerField, Case, When, Value
from django.db.models.functions import Cast
from django_filters import rest_framework as filters
from rest_framework.generics import GenericAPIView, ListAPIView
from rest_framework.parsers import JSONParser
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .filters import ClientListAPIFilter
from .serailizers import *
from users.api.views import StandardResultsSetPagination
from users.api.permission_class import HasPermission


class ClientQuickListView(ListAPIView):
    http_method_names = ['get']
    serializer_class = ClientQuickListSerializer
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = ClientListAPIFilter

    def get_permissions(self):
        if self.request.method == "GET":
            return [HasPermission('clients.view_client')]

    def get_queryset(self):
        qs = Client.objects.all().sorted_by_client_code()
        return qs


class ClientList(ListAPIView):
    http_method_names = ['get']

    def get_permissions(self):
        if self.request.method == "GET":
            return [HasPermission('clients.view_client')]

    pagination_class = StandardResultsSetPagination
    serializer_class = ClientCreateSerializer
    queryset = Client.objects.all().order_by('name')


class ClientView(GenericAPIView):
    http_method_names = ['get', 'post', 'put', 'delete']

    def get_permissions(self):
        if self.request.method == "GET":
            return [HasPermission('clients.view_client')]
        elif self.request.method == "POST":
            return [HasPermission('clients.add_client')]
        elif self.request.method == "PUT":
            return [HasPermission('clients.change_client')]
        elif self.request.method == "DELETE":
            return [HasPermission('clients.delete_client')]

    def get(self, *args, **kwargs):
        obj = get_object_or_404(Client, id=kwargs['pk'])
        slizer = ClientCreateSerializer(instance=obj)
        return Response(
            data={
                'data': slizer.data
            },
            status=status.HTTP_200_OK
        )

    def post(self, *args, **kwargs):
        post_data = JSONParser().parse(self.request)
        slizer = ClientCreateSerializer(data=post_data)
        if slizer.is_valid():
            client = slizer.save()
            client.created_by = self.request.user
            client.save()
            return Response(
                data={
                    'status': 'created'
                },
                status=status.HTTP_201_CREATED
            )
        else:
            return Response(
                data={'status': 'bad data', 'errors': slizer.errors},
                status=status.HTTP_400_BAD_REQUEST)

    def put(self, *args, **kwargs):
        obj = get_object_or_404(Client, id=kwargs['pk'])
        post_data = JSONParser().parse(self.request)
        slizer = ClientCreateSerializer(instance=obj, data=post_data, is_update=True)
        if slizer.is_valid():
            client = slizer.save()
            client.updated_by = self.request.user
            client.update_timestamp = timezone.now()
            client.save()
            return Response(
                data={
                    'status': 'updated'
                },
                status=status.HTTP_202_ACCEPTED
            )
        else:
            return Response(
                data={'status': 'bad data', 'errors': slizer.errors},
                status=status.HTTP_400_BAD_REQUEST)

    def delete(self, *args, **kwargs):
        obj = get_object_or_404(Client, id=kwargs['pk'])
        obj.delete()
        return Response(
            data={
                'status': 'deleted'
            },
            status=status.HTTP_202_ACCEPTED
        )
